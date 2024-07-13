using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories;
using Backend.WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _jobRepository;
    private readonly IRecruiterRepository _recruiterRepository;
    private readonly ISkillRepository _skillRepository;
    private readonly IMapper _mapper;
    public JobService(
        IJobRepository jobRepository,
        IRecruiterRepository recruiterRepository,
        ISkillRepository skillRepository,
        ITokenService tokenService,
        IMapper mapper)
    {
        _jobRepository = jobRepository;
        _recruiterRepository = recruiterRepository;
        _skillRepository = skillRepository;
        _mapper = mapper;
    }


    public async Task<IEnumerable<JobResponseModel>> GetAllJobsAsync()
    {
        var jobs = await _jobRepository.GetAllQueryable()
                    .Include(j => j.JobSkills)
                    .ThenInclude(js => js.Skill)
                    .Include(j => j.Recruiter)
                    .ThenInclude(r => r.Company)
                    .ToListAsync();
        return jobs.Select(_mapper.Map<JobResponseModel>);
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
        var recruiter = await _recruiterRepository.GetByIdAsync(job.RecruiterId) ?? throw new KeyNotFoundException("Recruiter not found");
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