using Backend.WebAPI.Models;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("recruiters")]
public class RecruiterController : ControllerBase
{
    private readonly ILogger<RecruiterController> _logger;
    private readonly IRecruiterService _recruiterService;

    public RecruiterController(ILogger<RecruiterController> logger, IRecruiterService recruiterService)
    {
        _logger = logger;
        _recruiterService = recruiterService;
    }

    [HttpPost]
    [Route("/register")]
    public async Task<IActionResult> RegisterAsync(RecruiterRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newUser = await _recruiterService.InsertRecruiterAsync(model);
            return Ok(newUser);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetAllRecruitersAsync()
    {
        try
        {
            var users = await _recruiterService.GetAllRecruitersAsync();
            return Ok(users);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetRecruiterByIdAsync(Guid id)
    {
        try
        {
            var user = await _recruiterService.GetRecruiterByIdAsync(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateRecruiterAsync(Guid id, RecruiterRequestModel model)
    {
        try
        {
            await _recruiterService.UpdateRecruiterAsync(id, model);
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

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteRecruiterAsync(Guid id)
    {
        try
        {
            await _recruiterService.DeleteRecruiterAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}