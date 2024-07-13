using Backend.WebAPI.Models;

namespace Backend.WebAPI.Services;

public interface IAdminService
{
    Task<LoginResponseModel> LoginAsync(LoginRequestModel login);
    Task<IEnumerable<AdminResponseModel>> GetAllAdminsAsync();
    Task<AdminResponseModel?> GetAdminByIdAsync(Guid id);
    Task<AdminResponseModel> InsertAdminAsync(AdminRequestModel admin);
    Task UpdateAdminAsync(Guid id, AdminRequestModel admin);
    Task DeleteAdminAsync(Guid id);
    Task ApproveCompanyAsync(Guid approverId, Guid companyId);
}