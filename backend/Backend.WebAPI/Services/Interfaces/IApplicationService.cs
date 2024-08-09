using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IApplicationService
{
    Task<PagedResponse<ApplicationResponseModel>> GetApplicationsAsync(Guid? jobId, Guid? candidateId, int? pageIndex, int? pageSize, JobType? type, Guid? fieldId, string? search, string? orderBy, bool? isDescending);
    Task<ApplicationResponseModel?> GetApplicationByIdAsync(Guid id);
    Task<ApplicationResponseModel> InsertApplicationAsync(ApplicationRequestModel application);
    Task UpdateApplicationAsync(Guid id, ApplicationRequestModel application);
    Task DeleteApplicationAsync(Guid id);
    Task UpdateApplicationStatusAsync(Guid id, ApplicationStatusType status);
}