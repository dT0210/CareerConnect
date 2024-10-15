using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Recruiters")]
public class Recruiter : BaseModel
{
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string PasswordHash { get; set; }

    public ICollection<Job> JobsPosted { get; set; }
    public Company Company { get; set; }
}