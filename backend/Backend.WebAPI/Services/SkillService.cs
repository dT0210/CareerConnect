using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class SkillService : ISkillService
{
    private readonly ISkillRepository _skillRepository;
    private readonly IRecruiterRepository _recruiterRepository;
    private readonly IMapper _mapper;
    public SkillService(ISkillRepository skillRepository, IRecruiterRepository recruiterRepository, ITokenService tokenService, IMapper mapper)
    {
        _skillRepository = skillRepository;
        _recruiterRepository = recruiterRepository;
        _mapper = mapper;
    }


    public async Task<PagedResponse<SkillResponseModel>> GetAllSkillsAsync(int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;
        var query = _skillRepository.GetAllQueryable().AsNoTracking();

        query = query.Where(x => string.IsNullOrWhiteSpace(searchPhraseLower) || x.Name.Contains(searchPhraseLower));

        var totalRecords = query.Count();
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Skill, object>>>
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
        List<Skill> skills;
        if (pageSize == null || pageIndex == null)
        {
            skills = await query.ToListAsync();
        }
        else
        {
            skills = await query
                .Skip((int)((pageIndex - 1) * pageSize))
                .Take((int)pageSize)
                .ToListAsync();
        }
        var response = new PagedResponse<SkillResponseModel>
        {
            PageIndex = 1,
            PageSize = pageSize ?? totalRecords,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)(pageSize ?? 1)),
            TotalRecords = totalRecords,
            Data = skills.Select(_mapper.Map<SkillResponseModel>).ToList()
        };
        return response;
    }

    public async Task<SkillResponseModel?> GetSkillByIdAsync(Guid id)
    {
        var skill = await _skillRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Skill not found");
        return _mapper.Map<SkillResponseModel>(skill);
    }

    public async Task<SkillResponseModel> InsertSkillAsync(SkillRequestModel skill)
    {
        var newSkill = _mapper.Map<Skill>(skill);
        await _skillRepository.InsertAsync(newSkill);
        await _skillRepository.SaveAsync();
        return _mapper.Map<SkillResponseModel>(newSkill);
    }

    public async Task UpdateSkillAsync(Guid id, SkillRequestModel skill)
    {
        var existingSkill = await _skillRepository.GetByIdAsync(id);
        if (existingSkill == null)
        {
            throw new KeyNotFoundException("Skill not found");
        }
        _mapper.Map(skill, existingSkill);
        _skillRepository.Update(existingSkill);
        await _skillRepository.SaveAsync();
    }

    public async Task DeleteSkillAsync(Guid id)
    {
        await _skillRepository.DeleteAsync(id);
        await _skillRepository.SaveAsync();
    }
}