using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Companies")]
public class Company : BaseModel
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Size { get; set; }
    public string Website { get; set; }
    public bool Approved { get; set; } = false;
    public Guid? ApproverId { get; set; }

    public Admin Approver { get; set; }
    public Recruiter Recruiter { get; set; }
}