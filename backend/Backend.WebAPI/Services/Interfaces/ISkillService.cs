using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface ISkillService
{
    Task<PagedResponse<SkillResponseModel>> GetAllSkillsAsync(int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search);
    Task<SkillResponseModel?> GetSkillByIdAsync(Guid id);
    Task<SkillResponseModel> InsertSkillAsync(SkillRequestModel skill);
    Task UpdateSkillAsync(Guid id, SkillRequestModel skill);
    Task DeleteSkillAsync(Guid id);
}