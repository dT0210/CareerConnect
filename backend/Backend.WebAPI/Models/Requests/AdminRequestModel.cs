using Backend.Shared.Enum;
using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models;

public class AdminRequestModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public AdminRoleType Role { get; set; }
    public string Password { get; set; }
    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; }
}