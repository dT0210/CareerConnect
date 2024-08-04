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
    private readonly IApplicationRepository _applicationRepository;
    private readonly IMapper _mapper;
    public JobService(
        IJobRepository jobRepository,
        IRecruiterRepository recruiterRepository,
        ISkillRepository skillRepository,
        IApplicationRepository applicationRepository,
        IMapper mapper)
    {
        _jobRepository = jobRepository;
        _recruiterRepository = recruiterRepository;
        _skillRepository = skillRepository;
        _applicationRepository = applicationRepository;
        _mapper = mapper;
    }


    public async Task<PagedResponse<JobResponseModel>> GetAllJobsAsync(
        int? pageIndex, int? pageSize, Guid? recruiterId, JobType? type,
        string? search, string? orderBy, bool? isDescending)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;
        var query = _jobRepository.GetAllQueryable()
                    .Include(j => j.Field)
                    .Include(j => j.JobSkills)
                    .ThenInclude(js => js.Skill)
                    .Include(j => j.Recruiter)
                    .ThenInclude(r => r.Company).AsNoTracking();

        query = query.Where(x => (recruiterId == null || x.RecruiterId == recruiterId)
                                && (type == null || x.Type == type)
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
                    { "modifiedAt", x => x.ModifiedAt}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the created date
        else
        {
            query = query.OrderBy(x => x.CreatedAt);
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
            TotalPages = (int)(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = jobs.Select(_mapper.Map<JobResponseModel>).ToList()
        };
        return response;
    }

    public async Task<PagedResponse<JobResponseModel>> GetAppliedJobs(Guid candidateId, int? pageIndex, int? pageSize, JobType? type, string? search, string? orderBy, bool? isDescending)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;

        var query = _applicationRepository.GetAllQueryable()
                    .Include(a => a.Job)
                        .ThenInclude(j => j.JobSkills)
                            .ThenInclude(js => js.Skill)
                    .Include(a => a.Job.Field)
                    .Include(a => a.Job.Recruiter.Company)
                    .AsNoTracking();

        query = query.Where(x => (type == null || x.Job.Type == type)
                                && (string.IsNullOrWhiteSpace(searchPhraseLower)
                                    || x.Job.Title.Contains(searchPhraseLower)
                                    || x.Job.Description.Contains(searchPhraseLower)));

        var totalRecords = query.Count();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Application, object>>>
                {
                    { "title", x => x.Job.Title},
                    { "type",  x => x.Job.Type },
                    { "deadline", x => x.Job.Deadline},
                    { "field", x => x.Job.Field },
                    { "appliedAt", x => x.CreatedAt}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the applied date
        else
        {
            query = query.OrderBy(x => x.CreatedAt);
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
            TotalPages = (int)(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = jobs.Select(_mapper.Map<JobResponseModel>).ToList()
        };
        return response;
    }

    public async Task<JobResponseModel?> GetJobByIdAsync(Guid id)
    {
        var job = await _jobRepository.GetAllQueryable()
                    .Where(j => j.Id == id)
                    .Include(j => j.JobSkills)
                    .ThenInclude(js => js.Skill)
                    .Include(j => j.Recruiter)
                    .ThenInclude(r => r.Company)
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
        await _jobRepository.InsertAsync(newJob);
        await _jobRepository.SaveAsync();
        return _mapper.Map<JobResponseModel>(newJob);
    }

    public async Task UpdateJobAsync(Guid id, JobRequestModel job)
    {
        var existingJob = await _jobRepository.GetByIdAsync(id);
        if (existingJob == null)
        {
            throw new KeyNotFoundException("Job not found");
        }
        _mapper.Map(job, existingJob);
        existingJob.JobSkills = new List<JobSkill>();
        foreach (var skillId in job.Skills)
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

    public async Task DeleteJobAsync(Guid id)
    {
        await _jobRepository.DeleteAsync(id);
        await _jobRepository.SaveAsync();
    }
}