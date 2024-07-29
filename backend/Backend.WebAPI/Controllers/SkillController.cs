using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("skills")]
public class SkillController : ControllerBase
{
    private readonly ILogger<SkillController> _logger;
    private readonly ISkillService _skillService;

    public SkillController(ILogger<SkillController> logger, ISkillService skillService)
    {
        _logger = logger;
        _skillService = skillService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAllSkillsAsync()
    {
        try
        {
            var users = await _skillService.GetAllSkillsAsync();
            return Ok(users);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetSkillByIdAsync(Guid id)
    {
        try
        {
            var user = await _skillService.GetSkillByIdAsync(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateSkillAsync(Guid id, SkillRequestModel model)
    {
        try
        {
            await _skillService.UpdateSkillAsync(id, model);
            return Ok();
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateSkillAsync(SkillRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newSkill = await _skillService.InsertSkillAsync(model);
            return Ok(newSkill);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteSkillAsync(Guid id)
    {
        try
        {
            await _skillService.DeleteSkillAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}