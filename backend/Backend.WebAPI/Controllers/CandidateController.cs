using Backend.Shared.Enum;
using Backend.WebAPI.Common.CustomException;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("candidates")]
public class CandidateController : ControllerBase
{
    private readonly ILogger<CandidateController> _logger;
    private readonly ICandidateService _candidateService;
    private readonly IApplicationService _applicationService;

    public CandidateController(ILogger<CandidateController> logger, ICandidateService candidateService, IApplicationService applicationService)
    {
        _logger = logger;
        _candidateService = candidateService;
        _applicationService = applicationService;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> RegisterAsync(CandidateRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newUser = await _candidateService.InsertCandidateAsync(model);
            return Ok(newUser);
        }
        catch (UniquePropertyException e) {
            return Conflict(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetAllCandidatesAsync()
    {
        try
        {
            var users = await _candidateService.GetAllCandidatesAsync();
            return Ok(users);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCandidateByIdAsync(Guid id)
    {
        try
        {
            var user = await _candidateService.GetCandidateByIdAsync(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateCandidateAsync(Guid id, CandidateRequestModel model)
    {
        try
        {
            await _candidateService.UpdateCandidateAsync(id, model);
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
    public async Task<IActionResult> DeleteCandidateAsync(Guid id)
    {
        try
        {
            await _candidateService.DeleteCandidateAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}/applied-jobs")]
    public async Task<IActionResult> GetAppliedJobs(Guid id, int? pageIndex, int? pageSize, Guid? recruiterId, JobType? type, string? search, string? orderBy, bool? isDescending) {
        try 
        {
            var jobs = await _applicationService.GetApplicationsAsync(null, id, pageIndex, pageSize, type, search, orderBy, isDescending);
            return Ok(jobs);
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
}