using Backend.WebAPI.Models;

namespace Backend.WebAPI.Services;

public interface IJobService
{
    Task<IEnumerable<JobResponseModel>> GetAllJobsAsync();
    Task<JobResponseModel?> GetJobByIdAsync(Guid id);
    Task<JobResponseModel> InsertJobAsync(JobRequestModel job);
    Task UpdateJobAsync(Guid id, JobRequestModel job);
    Task DeleteJobAsync(Guid id);
}