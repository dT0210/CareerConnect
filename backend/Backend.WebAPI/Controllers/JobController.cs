using System.Security.Claims;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("jobs")]
public class JobController : ControllerBase
{
    private readonly ILogger<JobController> _logger;
    private readonly IJobService _jobService;
    private Guid UserId => Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    private string Role => User.Claims.First(c => c.Type == ClaimTypes.Role).Value;
    public JobController(ILogger<JobController> logger, IJobService jobService)
    {
        _logger = logger;
        _jobService = jobService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAllJobsAsync(int? pageIndex, int? pageSize, Guid? recruiterId, JobType? type, Guid? field, string? search, string? orderBy, bool? isDescending)
    {
        try
        {
            var jobs = await _jobService.GetAllJobsAsync(pageIndex, pageSize, recruiterId, type, field, search, orderBy, isDescending);
            return Ok(jobs);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetJobByIdAsync(Guid id)
    {
        try
        {
            var job = await _jobService.GetJobByIdAsync(id);
            return Ok(job);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateJobAsync(Guid id, JobRequestModel model)
    {
        try
        {
            await _jobService.UpdateJobAsync(id, model);
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
    public async Task<IActionResult> CreateJobAsync(JobRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newJob = await _jobService.InsertJobAsync(model);
            return Ok(newJob);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteJobAsync(Guid id)
    {
        try
        {
            await _jobService.DeleteJobAsync(id, UserId, Role);
            return Ok();
        }
        catch (KeyNotFoundException e)
        {
            return NotFound("Job has already been deleted or doesn't exist");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}