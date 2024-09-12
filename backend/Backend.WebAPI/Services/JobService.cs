using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.Shared.Enum;
using Backend.WebAPI.Common.CustomException;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _jobRepository;
    private readonly IRecruiterRepository _recruiterRepository;
    private readonly ISkillRepository _skillRepository;
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;
    public JobService(
        IJobRepository jobRepository,
        IRecruiterRepository recruiterRepository,
        ISkillRepository skillRepository,
        INotificationService notificationService,
        IMapper mapper)
    {
        _jobRepository = jobRepository;
        _recruiterRepository = recruiterRepository;
        _skillRepository = skillRepository;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<PagedResponse<JobResponseModel>> GetAllJobsAsync(
        int? pageIndex, int? pageSize, Guid? recruiterId, JobType? type, Guid? fieldId,
        string? search, string? orderBy, bool? isDescending)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;
        var query = _jobRepository.GetAllQueryable()
                    .Include(j => j.Field)
                    .Include(j => j.JobSkills)
                    .ThenInclude(js => js.Skill)
                    .Include(j => j.Recruiter)
                    .ThenInclude(r => r.Company)
                    .Include(j => j.Applications).AsNoTracking();

        query = query.Where(x => ((recruiterId == null && x.DeletedBy == null) || x.RecruiterId == recruiterId)
                                && (type == null || x.Type == type)
                                && (fieldId == null || x.FieldId == fieldId)
                                && (string.IsNullOrWhiteSpace(searchPhraseLower)
                                    || x.Title.Contains(searchPhraseLower)
                                    || x.Description.Contains(searchPhraseLower)));

        var totalRecords = query.Count();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Job, object>>>
                {
                    { "title", x => x.Title},
                    { "type",  x => x.Type },
                    { "deadline", x => x.Deadline},
                    { "field", x => x.Field },
                    { "createdAt", x => x.CreatedAt},
                    { "modifiedAt", x => x.ModifiedAt},
                    { "applications", x => x.Applications.Count}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the created date
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }
        pageIndex ??= 1;
        pageSize ??= 10;
        var jobs = await query
                .Skip((int)((pageIndex - 1) * pageSize))
                .Take((int)pageSize)
                .ToListAsync();

        var response = new PagedResponse<JobResponseModel>
        {
            PageIndex = (int)pageIndex,
            PageSize = (int)pageSize,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = jobs.Select(_mapper.Map<JobResponseModel>).ToList()
        };
        return response;
    }

    public async Task<JobResponseModel?> GetJobByIdAsync(Guid id)
    {
        var job = await _jobRepository.GetAllQueryable()
                    .Where(j => j.Id == id)
                    .Include(j => j.Field)
                    .Include(j => j.JobSkills)
                    .ThenInclude(js => js.Skill)
                    .Include(j => j.Recruiter)
                    .ThenInclude(r => r.Company)
                    .Include(j => j.Applications)
                    .FirstOrDefaultAsync();
        return _mapper.Map<JobResponseModel>(job);
    }

    public async Task<JobResponseModel> InsertJobAsync(JobRequestModel job)
    {
        var recruiter = await _recruiterRepository.GetAllQueryable()
                        .Include(r => r.Company)
                        .Where(r => r.Id == job.RecruiterId)
                        .FirstOrDefaultAsync()
                        ?? throw new KeyNotFoundException("Recruiter not found");
        if (recruiter.Company.Status != CompanyStatusType.Approved) throw new ActionNotAllowedException("Company profile has to be approved to post job.");

        var newJob = _mapper.Map<Job>(job);
        newJob.JobSkills = new List<JobSkill>();

        // Fetch each skill by its ID and create a JobSkill entity
        if (job.Skills != null)
        {
            foreach (var skillId in job.Skills)
            {
                var skill = await _skillRepository.GetByIdAsync(skillId)
                            ?? throw new KeyNotFoundException($"Skill with ID {skillId} not found");

                var jobSkill = new JobSkill
                {
                    JobId = newJob.Id,
                    SkillId = skillId,
                    Job = newJob,
                    Skill = skill
                };

                newJob.JobSkills.Add(jobSkill);
            }
        }
        await _jobRepository.InsertAsync(newJob);
        await _jobRepository.SaveAsync();
        return _mapper.Map<JobResponseModel>(newJob);
    }

    public async Task UpdateJobAsync(Guid id, JobRequestModel job)
    {
        var existingJob = await _jobRepository.GetAllQueryable().Where(j => j.Id == id).Include(j => j.JobSkills).FirstOrDefaultAsync();
        if (existingJob == null)
        {
            throw new KeyNotFoundException("Job not found");
        }
        _mapper.Map(job, existingJob);

        var existingSkillIds = existingJob.JobSkills.Select(js => js.SkillId).ToList();
        var newSkillIds = job.Skills ?? [];
        var skillsToAdd = newSkillIds.Except(existingSkillIds).ToList();
        var skillsToRemove = existingSkillIds.Except(newSkillIds).ToList();

        foreach (var skillId in skillsToRemove)
        {
            var jobSkill = existingJob.JobSkills.FirstOrDefault(js => js.SkillId == skillId);
            if (jobSkill != null)
            {
                existingJob.JobSkills.Remove(jobSkill);
            }
        }

        foreach (var skillId in skillsToAdd)
        {
            var skill = await _skillRepository.GetByIdAsync(skillId)
                        ?? throw new KeyNotFoundException($"Skill with ID {skillId} not found");

            var jobSkill = new JobSkill
            {
                JobId = existingJob.Id,
                SkillId = skillId,
                Job = existingJob,
                Skill = skill
            };

            existingJob.JobSkills.Add(jobSkill);
        }
        _jobRepository.Update(existingJob);
        await _jobRepository.SaveAsync();
    }

    public async Task DeleteJobAsync(Guid id, Guid userId, string role)
    {
        var existingJob = await _jobRepository.GetAllQueryable().Where(j => j.Id == id).Where(j => j.DeletedBy == null).FirstOrDefaultAsync();
        if (existingJob == null)
        {
            throw new KeyNotFoundException("Job not found");
        }
        if (role == "admin") {
            await _notificationService.InsertNotificationAsync(existingJob.RecruiterId, $"{existingJob.Title} has been deleted by an admin");
        }
        existingJob.DeletedBy = userId;
        existingJob.DeletedAt = DateTime.Now;
        _jobRepository.Update(existingJob);
        await _jobRepository.SaveAsync();
    }
}