using Backend.WebAPI.Models;

namespace Backend.WebAPI.Services;

public interface ICompanyService
{
    Task<IEnumerable<CompanyResponseModel>> GetAllCompanysAsync();
    Task<CompanyResponseModel?> GetCompanyByIdAsync(Guid id);
    Task<CompanyResponseModel> InsertCompanyAsync(CompanyRequestModel company);
    Task UpdateCompanyAsync(Guid id, CompanyRequestModel company);
    Task DeleteCompanyAsync(Guid id);
    Task ApproveCompanyAsync(Guid companyId, Guid adminId);
}