namespace Backend.WebAPI.Models.Requests;
using System.ComponentModel.DataAnnotations;

public class CandidateRequestModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string Password { get; set; }
    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; }
}