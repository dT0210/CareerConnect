using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

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


    public async Task<IEnumerable<SkillResponseModel>> GetAllSkillsAsync()
    {
        var skills = await _skillRepository.GetAllAsync();
        return skills.Select(_mapper.Map<SkillResponseModel>);
    }

    public async Task<SkillResponseModel?> GetSkillByIdAsync(Guid id)
    {
        var skill = await _skillRepository.GetByIdAsync(id);
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