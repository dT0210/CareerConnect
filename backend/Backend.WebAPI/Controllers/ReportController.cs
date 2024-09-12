using System.Security.Claims;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("reports")]
public class ReportController : ControllerBase
{
    private readonly ILogger<ReportController> _logger;
    private readonly IReportService _reportService;
    private Guid UserId => Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

    public ReportController(ILogger<ReportController> logger, IReportService reportService)
    {
        _logger = logger;
        _reportService = reportService;
    }

    [HttpGet]
    public async Task<IActionResult> GetReportsAsync(ReportStatusType? status,int? pageIndex, int? pageSize, JobType? type, Guid? field, string? search, string? orderBy, bool? isDescending)
    {
        try
        {
            var reports = await _reportService.GetAllReportsAsync(status, pageIndex, pageSize, orderBy, isDescending, search);
            return Ok(reports);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetReportByIdAsync(Guid id)
    {
        try
        {
            var report = await _reportService.GetReportByIdAsync(id);
            return Ok(report);
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
    public async Task<IActionResult> UpdateReportStatusAsync(Guid id, ReportStatusType status)
    {
        try
        {
            await _reportService.UpdateReportStatusAsync(id, status);
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
    public async Task<IActionResult> CreateReportAsync(ReportRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newReport = await _reportService.InsertReportAsync(model);
            return Ok(newReport);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteReportAsync(Guid id)
    {
        try
        {
            await _reportService.DeleteReportAsync(id);
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
}