using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public class FieldService : IFieldService
{
    private readonly IFieldRepository _fieldRepository;
    private readonly IMapper _mapper;
    public FieldService(IFieldRepository fieldRepository, ITokenService tokenService, IMapper mapper)
    {
        _fieldRepository = fieldRepository;
        _mapper = mapper;
    }


    public async Task<IEnumerable<FieldResponseModel>> GetAllFieldsAsync()
    {
        var fields = await _fieldRepository.GetAllAsync();
        return fields.Select(_mapper.Map<FieldResponseModel>);
    }

    public async Task<FieldResponseModel?> GetFieldByIdAsync(Guid id)
    {
        var field = await _fieldRepository.GetByIdAsync(id);
        return _mapper.Map<FieldResponseModel>(field);
    }

    public async Task<FieldResponseModel> InsertFieldAsync(FieldRequestModel field)
    {
        var newField = _mapper.Map<Field>(field);
        await _fieldRepository.InsertAsync(newField);
        await _fieldRepository.SaveAsync();
        return _mapper.Map<FieldResponseModel>(newField);
    }

    public async Task UpdateFieldAsync(Guid id, FieldRequestModel field)
    {
        var existingField = await _fieldRepository.GetByIdAsync(id);
        if (existingField == null)
        {
            throw new KeyNotFoundException("Field not found");
        }
        _mapper.Map(field, existingField);
        _fieldRepository.Update(existingField);
        await _fieldRepository.SaveAsync();
    }

    public async Task DeleteFieldAsync(Guid id)
    {
        await _fieldRepository.DeleteAsync(id);
        await _fieldRepository.SaveAsync();
    }
}