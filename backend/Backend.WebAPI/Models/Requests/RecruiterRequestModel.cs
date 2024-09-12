using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class RecruiterRequestModel
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    [Required]
    [MinLength(8)]
    public string Password { get; set; }
    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; }
}