using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Admins")]
public class Admin : BaseModel
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public AdminRoleType Role { get; set; }
    public string PasswordHash { get; set; }

    public ICollection<Company> ApprovedCompanies { get; set; }
}