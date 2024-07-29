using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface ISkillService
{
    Task<IEnumerable<SkillResponseModel>> GetAllSkillsAsync();
    Task<SkillResponseModel?> GetSkillByIdAsync(Guid id);
    Task<SkillResponseModel> InsertSkillAsync(SkillRequestModel skill);
    Task UpdateSkillAsync(Guid id, SkillRequestModel skill);
    Task DeleteSkillAsync(Guid id);
}