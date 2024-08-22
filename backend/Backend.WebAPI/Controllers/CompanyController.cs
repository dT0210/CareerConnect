using System.Security.Claims;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("companies")]
public class CompanyController : ControllerBase
{
    private readonly ILogger<CompanyController> _logger;
    private readonly ICompanyService _companyService;
    private Guid UserId => Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

    public CompanyController(ILogger<CompanyController> logger, ICompanyService companyService)
    {
        _logger = logger;
        _companyService = companyService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAllCompanysAsync(
        [FromQuery] int? pageIndex, 
        [FromQuery] int? pageSize, 
        [FromQuery] CompanyStatusType? status, 
        [FromQuery] string? search,
        [FromQuery] string? orderBy,
        [FromQuery] bool? isDescending
    ) {
        try
        {
            var companies = await _companyService.GetAllCompanysAsync(pageIndex, pageSize, status, search, orderBy, isDescending);
            return Ok(companies);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCompanyByIdAsync(Guid id)
    {
        try
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            return Ok(company);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateCompanyAsync(Guid id, CompanyRequestModel model)
    {
        try
        {
            await _companyService.UpdateCompanyAsync(id, model);
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

    [HttpPatch]
    [Route("approve/{id}")]
    public async Task<IActionResult> ApproveCompanyAsync(Guid id, Guid adminId)
    {
        try
        {
            await _companyService.ModerateCompanyAsync(id, adminId, true);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPatch]
    [Route("reject/{id}")]
    public async Task<IActionResult> RejectCompanyAsync(Guid id, Guid adminId)
    {
        try
        {
            await _companyService.ModerateCompanyAsync(id, adminId, false);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompanyAsync(CompanyRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newCompany = await _companyService.InsertCompanyAsync(model);
            return Ok(newCompany);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteCompanyAsync(Guid id)
    {
        try
        {
            await _companyService.DeleteCompanyAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}