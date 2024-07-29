using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class LoginRequestModel {
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(64, MinimumLength = 8)]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}