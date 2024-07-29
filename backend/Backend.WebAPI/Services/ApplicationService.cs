using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly IJobRepository _jobRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly IMapper _mapper;
    public ApplicationService(IApplicationRepository applicationRepository, IJobRepository jobRepository, ICandidateRepository candidateRepository, ITokenService tokenService, IMapper mapper)
    {
        _applicationRepository = applicationRepository;
        _jobRepository = jobRepository;
        _candidateRepository = candidateRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ApplicationResponseModel>> GetApplicationsAsync(Guid? jobId, Guid? candidateId)
    {
        var applications = await _applicationRepository.GetAllQueryable()
                        .Where(a =>
                            (jobId == null || a.JobId == jobId)
                        && (candidateId == null || a.CandidateId == candidateId))
                        .Include(a => a.Job)
                        .Include(a => a.Candidate)
                        .ToListAsync();
        return _mapper.Map<IEnumerable<ApplicationResponseModel>>(applications);
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
}