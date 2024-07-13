using Backend.WebAPI.Models;

namespace Backend.WebAPI.Services;

public interface ICandidateService {
    Task<LoginResponseModel> LoginAsync(LoginRequestModel login);
    Task<IEnumerable<CandidateResponseModel>> GetAllCandidatesAsync();
    Task<CandidateResponseModel?> GetCandidateByIdAsync(Guid id);
    Task<CandidateResponseModel> InsertCandidateAsync(CandidateRequestModel candidate);
    Task UpdateCandidateAsync(Guid id, CandidateRequestModel candidate);
    Task DeleteCandidateAsync(Guid id);
}