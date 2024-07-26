using Backend.Shared.Enum;
using Backend.WebAPI.Models;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface ICompanyService
{
    Task<PagedResponse<CompanyResponseModel>> GetAllCompanysAsync(int? pageIndex, int? pageSize, CompanyStatusType? status, string? search, string? orderBy, bool? isDescending);
    Task<CompanyResponseModel?> GetCompanyByIdAsync(Guid id);
    Task<CompanyResponseModel> InsertCompanyAsync(CompanyRequestModel company);
    Task UpdateCompanyAsync(Guid id, CompanyRequestModel company);
    Task DeleteCompanyAsync(Guid id);
    Task ApproveCompanyAsync(Guid companyId, Guid adminId);
    Task RejectCompanyAsync(Guid companyId, Guid adminId);
}