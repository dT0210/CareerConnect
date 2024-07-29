using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IRecruiterService
{
    Task<LoginResponseModel> LoginAsync(LoginRequestModel login);
    Task<IEnumerable<RecruiterResponseModel>> GetAllRecruitersAsync();
    Task<RecruiterResponseModel?> GetRecruiterByIdAsync(Guid id);
    Task<RecruiterResponseModel> InsertRecruiterAsync(RecruiterRequestModel recruiter);
    Task UpdateRecruiterAsync(Guid id, RecruiterRequestModel recruiter);
    Task DeleteRecruiterAsync(Guid id);
    Task CreateCompanyProfileAsync(Guid id, CompanyRequestModel companyProfile);
}