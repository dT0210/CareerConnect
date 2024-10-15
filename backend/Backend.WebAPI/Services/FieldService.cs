using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class FieldService : IFieldService
{
    private readonly IFieldRepository _fieldRepository;
    private readonly IMapper _mapper;
    public FieldService(IFieldRepository fieldRepository, IMapper mapper)
    {
        _fieldRepository = fieldRepository;
        _mapper = mapper;
    }


    public async Task<PagedResponse<FieldResponseModel>> GetAllFieldsAsync(int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;
        var query = _fieldRepository.GetAllQueryable().AsNoTracking();

        query = query.Where(x => string.IsNullOrWhiteSpace(searchPhraseLower) || x.Name.Contains(searchPhraseLower));

        var totalRecords = await query.CountAsync();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Field, object>>>
                {
                    { "name", x => x.Name},
                    { "createdAt", x => x.CreatedAt},
                    { "modifiedAt", x => x.ModifiedAt}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the created date
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }
        List<Field> fields;
        if (pageSize == null || pageIndex == null)
        {
            fields = await query.ToListAsync();
        }
        else
        {
            fields = await query
                .Skip((int)((pageIndex - 1) * pageSize))
                .Take((int)pageSize)
                .ToListAsync();
        }
        var response = new PagedResponse<FieldResponseModel>
        {
            PageIndex = 1,
            PageSize = pageSize ?? totalRecords,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)(pageSize ?? 1)),
            TotalRecords = totalRecords,
            Data = fields.Select(_mapper.Map<FieldResponseModel>).ToList()
        };
        return response;
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