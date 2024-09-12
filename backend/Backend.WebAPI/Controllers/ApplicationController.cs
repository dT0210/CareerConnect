using System.Security.Claims;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("applications")]
public class ApplicationController : ControllerBase
{
    private readonly ILogger<ApplicationController> _logger;
    private readonly IApplicationService _applicationService;
    private Guid UserId => Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

    public ApplicationController(ILogger<ApplicationController> logger, IApplicationService applicationService)
    {
        _logger = logger;
        _applicationService = applicationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetApplicationsAsync(Guid? jobId, Guid? candidateId, Guid? recruiterId, int? pageIndex, int? pageSize, JobType? type, Guid? field, string? search, string? orderBy, bool? isDescending)
    {
        try
        {
            var applications = await _applicationService.GetApplicationsAsync(jobId, candidateId, recruiterId, pageIndex, pageSize, type, field, search, orderBy, isDescending);
            return Ok(applications);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetApplicationByIdAsync(Guid id)
    {
        try
        {
            var application = await _applicationService.GetApplicationByIdAsync(id);
            return Ok(application);
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

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateApplicationAsync(Guid id, ApplicationRequestModel model)
    {
        try
        {
            await _applicationService.UpdateApplicationAsync(id, model);
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
    public async Task<IActionResult> CreateApplicationAsync(ApplicationRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newApplication = await _applicationService.InsertApplicationAsync(model);
            return Ok(newApplication);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteApplicationAsync(Guid id)
    {
        try
        {
            await _applicationService.DeleteApplicationAsync(id);
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

    [HttpPut]
    [Route("{id}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(Guid id, [FromBody]ApplicationStatusType status) {
        try
        {
            await _applicationService.UpdateApplicationStatusAsync(id, status);
            return Ok();
        }
        catch (KeyNotFoundException e) 
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            _logger.LogError(e.ToString());
            return StatusCode(500, e.Message);
        }
    }
}