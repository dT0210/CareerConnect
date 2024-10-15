using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly IJobRepository _jobRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;
    public ApplicationService(IApplicationRepository applicationRepository, IJobRepository jobRepository, ICandidateRepository candidateRepository, INotificationService notificationService, IMapper mapper)
    {
        _applicationRepository = applicationRepository;
        _jobRepository = jobRepository;
        _candidateRepository = candidateRepository;
        _notificationService = notificationService;
        _mapper = mapper;
    }

    public async Task<PagedResponse<ApplicationResponseModel>> GetApplicationsAsync(Guid? jobId, Guid? candidateId, Guid? recruiterId, int? pageIndex, int? pageSize, JobType? type, Guid? fieldId, string? search, string? orderBy, bool? isDescending)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;

        var query = _applicationRepository.GetAllQueryable()
                    .Include(a => a.Candidate)
                    .Include(a => a.Job)
                        .ThenInclude(j => j.JobSkills)
                            .ThenInclude(js => js.Skill)
                    .Include(a => a.Job.Field)
                    .Include(a => a.Job.Recruiter.Company)
                    .AsNoTracking();

        query = query.Where(x => (jobId == null || x.JobId == jobId)
                                && (candidateId == null || x.CandidateId == candidateId)
                                && (fieldId == null || x.Job.FieldId == fieldId)
                                && (type == null || x.Job.Type == type)
                                && (string.IsNullOrWhiteSpace(searchPhraseLower)
                                    || x.Job.Title.Contains(searchPhraseLower)
                                    || x.Job.Description.Contains(searchPhraseLower)
                                    || x.Candidate.Name.Contains(searchPhraseLower)
                                    || x.Candidate.Email.Contains(searchPhraseLower)));

        var totalRecords = await query.CountAsync();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Application, object>>>
                {
                    { "title", x => x.Job.Title},
                    { "type",  x => x.Job.Type },
                    { "deadline", x => x.Job.Deadline},
                    { "field", x => x.Job.Field },
                    { "appliedAt", x => x.CreatedAt},
                    { "name", x => x.Candidate.Name},
                    { "email", x=> x.Candidate.Email},
                    { "phoneNumber", x => x.Candidate.PhoneNumber},
                    { "address", x=>x.Candidate.Address}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the applied date
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }
        pageIndex ??= 1;
        pageSize ??= 10;
        var apps = await query
                .Skip((int)((pageIndex - 1) * pageSize))
                .Take((int)pageSize)
                .ToListAsync();

        var response = new PagedResponse<ApplicationResponseModel>
        {
            PageIndex = (int)pageIndex,
            PageSize = (int)pageSize,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = apps.Select(_mapper.Map<ApplicationResponseModel>).ToList()
        };
        return response;
    }

    public async Task<ApplicationResponseModel?> GetApplicationByIdAsync(Guid id)
    {
        var application = await _applicationRepository.GetAllQueryable().Include(a => a.Job).Include(a => a.Candidate).Where(a => a.Id == id).ToListAsync();
        return _mapper.Map<ApplicationResponseModel>(application);
    }

    public async Task<ApplicationResponseModel> InsertApplicationAsync(ApplicationRequestModel application)
    {
        var job = await _jobRepository.GetByIdAsync(application.JobId) ?? throw new KeyNotFoundException("Job not found");
        var candidate = await _candidateRepository.GetByIdAsync(application.CandidateId) ?? throw new KeyNotFoundException("Candidate not found");
        
        var newApplication = _mapper.Map<Application>(application);
        await _applicationRepository.InsertAsync(newApplication);
        await _applicationRepository.SaveAsync();

        await _notificationService.InsertNotificationAsync(job.RecruiterId, $"{job.Title} has a new application.");
        return _mapper.Map<ApplicationResponseModel>(newApplication);
    }

    public async Task UpdateApplicationAsync(Guid id, ApplicationRequestModel application)
    {
        var existingApplication = await _applicationRepository.GetByIdAsync(id);
        if (existingApplication == null)
        {
            throw new KeyNotFoundException("Application not found");
        }
        _mapper.Map(application, existingApplication);
        _applicationRepository.Update(existingApplication);
        await _applicationRepository.SaveAsync();
    }

    public async Task DeleteApplicationAsync(Guid id)
    {
        await _applicationRepository.DeleteAsync(id);
        await _applicationRepository.SaveAsync();
    }

    public async Task UpdateApplicationStatusAsync(Guid id, ApplicationStatusType status)
    {
        var existingApplication = await _applicationRepository.GetAllQueryable()
                                    .Where(a => a.Id == id)
                                    .Include(a => a.Job.Recruiter)
                                    .ThenInclude(r => r.Company)
                                    .FirstOrDefaultAsync()
                                    ?? throw new KeyNotFoundException("Application not found.");
        existingApplication.Status = status;
        _applicationRepository.Update(existingApplication);
        await _applicationRepository.SaveAsync();
        string msg = $"Mr/Ms. {existingApplication.Job.Recruiter.Name} from {existingApplication.Job.Recruiter.Company.Name}";
        switch (status)
        {
            case ApplicationStatusType.Seen:
                msg += " has seen your application.";
                break;
            case ApplicationStatusType.Suitable:
                msg += " has evaluated your application as suitable.";
                break;
            case ApplicationStatusType.NotSuitable:
                msg += " has evaluated your application as not suitable.";
                break;
            default:
                break;
        }
        await _notificationService.InsertNotificationAsync(existingApplication.CandidateId, msg);
    }
}