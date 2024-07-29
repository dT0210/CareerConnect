using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.WebAPI.Models;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("auth")]
public class AuthenticationController : ControllerBase
{
    private readonly ICandidateService _candidateService;
    private readonly IRecruiterService _recruiterService;
    private readonly IAdminService _adminService;
    public AuthenticationController(
        ICandidateService candidateService, 
        IRecruiterService recruiterService, 
        IAdminService adminService
    ) {
        _candidateService = candidateService;
        _recruiterService = recruiterService;
        _adminService = adminService;
    }

    [HttpPost("login/candidate")]
    public async Task<IActionResult> CandidateLoginAsync([FromBody] LoginRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            var res = new LoginResponseModel
            {
                Success = false,
                Message = "Invalid username or password"
            };
            return BadRequest(res);
        }

        var response = await _candidateService.LoginAsync(model);
        if (response.Success)
        {
            return Ok(response);
        }

        return Unauthorized(response);
    }

    [HttpPost("login/recruiter")]
    public async Task<IActionResult> RecruiterLoginAsync([FromBody] LoginRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            var res = new LoginResponseModel
            {
                Success = false,
                Message = "Invalid username or password"
            };
            return BadRequest(res);
        }

        var response = await _recruiterService.LoginAsync(model);
        if (response.Success)
        {
            return Ok(response);
        }

        return Unauthorized(response);
    }

    [HttpPost("login/admin")]
    public async Task<IActionResult> AdminLoginAsync([FromBody] LoginRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            var res = new LoginResponseModel
            {
                Success = false,
                Message = "Invalid username or password"
            };
            return BadRequest(res);
        }

        var response = await _adminService.LoginAsync(model);
        if (response.Success)
        {
            return Ok(response);
        }

        return Unauthorized(response);
    }
}