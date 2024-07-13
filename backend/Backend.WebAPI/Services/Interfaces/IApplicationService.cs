using Backend.WebAPI.Models;

namespace Backend.WebAPI.Services;

public interface IApplicationService
{
    Task<IEnumerable<ApplicationResponseModel>> GetApplicationsAsync(Guid? jobId, Guid? candidateId);
    Task<ApplicationResponseModel?> GetApplicationByIdAsync(Guid id);
    Task<ApplicationResponseModel> InsertApplicationAsync(ApplicationRequestModel application);
    Task UpdateApplicationAsync(Guid id, ApplicationRequestModel application);
    Task DeleteApplicationAsync(Guid id);
}