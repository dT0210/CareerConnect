using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Companies")]
public class Company : BaseModel
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address {get; set;}
    public int Size { get; set; }
    public string Website { get; set; }
    public string? ImageUrl {get; set;}
    public CompanyStatusType Status {get; set;} = CompanyStatusType.Waiting;
    public DateTime RequestedAt {get; set;} = DateTime.Now;
    public Guid RecruiterId {get; set;}
    public Guid? ApproverId { get; set; }

    public Admin Approver { get; set; }
    public Recruiter Recruiter { get; set; }
}