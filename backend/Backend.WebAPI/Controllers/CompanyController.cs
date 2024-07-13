using System.Security.Claims;
using Backend.WebAPI.Models;
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
    public async Task<IActionResult> GetAllCompanysAsync()
    {
        try
        {
            var users = await _companyService.GetAllCompanysAsync();
            return Ok(users);
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
            var user = await _companyService.GetCompanyByIdAsync(id);
            return Ok(user);
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
            await _companyService.ApproveCompanyAsync(id, adminId);
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