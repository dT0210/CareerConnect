using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Users")]
public class User : BaseModel
{
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string PasswordHash { get; set; }
    public UserType Type { get; set; }

    public ICollection<Application>? AppliedApplications { get; set; }
    public ICollection<Job>? JobsPosted { get; set; }
    public Company? Company { get; set; }
}