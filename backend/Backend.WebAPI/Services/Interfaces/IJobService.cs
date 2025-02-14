using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IJobService
{
    Task<PagedResponse<JobResponseModel>> GetAllJobsAsync(int? pageIndex, int? pageSize, Guid? recruiterId, JobType? type, Guid? fieldId, string? search, string? orderBy, bool? isDescending, bool? expired);
    Task<JobResponseModel?> GetJobByIdAsync(Guid id);
    Task<JobResponseModel> InsertJobAsync(JobRequestModel job);
    Task UpdateJobAsync(Guid id, JobRequestModel job);
    Task DeleteJobAsync(Guid id, Guid userId, string role);
}