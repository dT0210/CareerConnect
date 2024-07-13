namespace Backend.WebAPI.Models;
using System.ComponentModel.DataAnnotations;

public class RecruiterRequestModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Password { get; set; }
    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; }
}