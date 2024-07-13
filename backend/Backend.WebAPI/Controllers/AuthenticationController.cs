using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.WebAPI.Models;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("auth")]
public class AuthenticationController : ControllerBase
{
    private readonly ICandidateService _candidateService;
    public AuthenticationController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpPost("login/candidate")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequestModel model)
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
}