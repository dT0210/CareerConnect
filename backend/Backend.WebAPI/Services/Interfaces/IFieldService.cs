using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IFieldService
{
    Task<IEnumerable<FieldResponseModel>> GetAllFieldsAsync();
    Task<FieldResponseModel?> GetFieldByIdAsync(Guid id);
    Task<FieldResponseModel> InsertFieldAsync(FieldRequestModel field);
    Task UpdateFieldAsync(Guid id, FieldRequestModel field);
    Task DeleteFieldAsync(Guid id);
}