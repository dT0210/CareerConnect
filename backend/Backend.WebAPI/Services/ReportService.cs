using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly IJobRepository _jobRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly IMapper _mapper;
    private readonly INotificationService _notificationService;
    public ReportService(
        IReportRepository reportRepository,
        IJobRepository jobRepository,
        ICandidateRepository candidateRepository,
        IMapper mapper,
        INotificationService notificationService
    )
    {
        _reportRepository = reportRepository;
        _jobRepository = jobRepository;
        _candidateRepository = candidateRepository;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<PagedResponse<ReportResponseModel>> GetAllReportsAsync(ReportStatusType? status, int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;

        var query = _reportRepository.GetAllQueryable()
                    .Include(a => a.Candidate)
                    .Include(a => a.Job)
                        .ThenInclude(j => j.JobSkills)
                            .ThenInclude(js => js.Skill)
                    .Include(a => a.Job.Field)
                    .Include(a => a.Job.Recruiter.Company)
                    .AsNoTracking();

        query = query.Where(x => /*(jobId == null || x.JobId == jobId)
                                && (candidateId == null || x.CandidateId == candidateId)
                                && (fieldId == null || x.Job.FieldId == fieldId)
                                && (type == null || x.Job.Type == type)
                                &&*/ (string.IsNullOrWhiteSpace(searchPhraseLower)
                                    || x.Job.Title.Contains(searchPhraseLower)
                                    || x.Job.Description.Contains(searchPhraseLower)
                                    || x.Candidate.Name.Contains(searchPhraseLower)
                                    || x.Candidate.Email.Contains(searchPhraseLower))
                                && (status == null || x.Status == status));

        var totalRecords = await query.CountAsync();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Report, object>>>
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

        var response = new PagedResponse<ReportResponseModel>
        {
            PageIndex = (int)pageIndex,
            PageSize = (int)pageSize,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = apps.Select(_mapper.Map<ReportResponseModel>).ToList()
        };
        return response;
    }

    public async Task<ReportResponseModel?> GetReportByIdAsync(Guid id)
    {
        var report = await _reportRepository.GetAllQueryable()
                    .Include(a => a.Candidate)
                    .Include(a => a.Job)
                        .ThenInclude(j => j.JobSkills)
                            .ThenInclude(js => js.Skill)
                    .Include(a => a.Job.Field)
                    .Include(a => a.Job.Recruiter.Company)
                    .AsNoTracking()
                    .Where(a => a.Id == id).FirstOrDefaultAsync();
        return _mapper.Map<ReportResponseModel>(report);
    }

    public async Task<ReportResponseModel> InsertReportAsync(ReportRequestModel report)
    {
        var job = await _jobRepository.GetByIdAsync(report.JobId) ?? throw new KeyNotFoundException("Job not found");
        var candidate = await _candidateRepository.GetByIdAsync(report.CandidateId) ?? throw new KeyNotFoundException("Candidate not found");

        var newReport = _mapper.Map<Report>(report);
        await _reportRepository.InsertAsync(newReport);
        await _reportRepository.SaveAsync();

        await _notificationService.InsertNotificationAsync(job.RecruiterId, $"A candidate has reported your job {job.Title}. An admin will review and resolve this report.");
        return _mapper.Map<ReportResponseModel>(newReport);
    }

    public async Task UpdateReportStatusAsync(Guid id, ReportStatusType status)
    {
        var existingReport = await _reportRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Report not found");
        existingReport.Status = status;
        _reportRepository.Update(existingReport);
        await _reportRepository.SaveAsync();
    }

    public Task DeleteReportAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}