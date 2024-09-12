using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IFieldService
{
    Task<PagedResponse<FieldResponseModel>> GetAllFieldsAsync(int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search);
    Task<FieldResponseModel?> GetFieldByIdAsync(Guid id);
    Task<FieldResponseModel> InsertFieldAsync(FieldRequestModel field);
    Task UpdateFieldAsync(Guid id, FieldRequestModel field);
    Task DeleteFieldAsync(Guid id);
}