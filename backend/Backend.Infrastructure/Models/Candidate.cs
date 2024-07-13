using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Candidates")]
public class Candidate : BaseModel
{
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string PasswordHash { get; set; }

    public ICollection<Application>? AppliedApplications { get; set; }
}