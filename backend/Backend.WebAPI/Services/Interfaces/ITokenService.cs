using System.IdentityModel.Tokens.Jwt;
using Backend.Infrastructure.Models;

namespace Backend.WebAPI.Services;

public interface ITokenService
{
    string GenerateJWT(Candidate user);
    string GenerateJWT(Admin user);
    string GenerateJWT(Recruiter user);
}