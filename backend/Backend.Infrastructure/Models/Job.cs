using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Jobs")]
public class Job : BaseModel
{
    public Guid RecruiterId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Field { get; set; }
    public DateTime Deadline { get; set; }
    public JobType Type { get; set; }
    public string Salary { get; set; }
    public string Experience { get; set; }

    public Recruiter Recruiter { get; set; }
    public ICollection<JobSkill> JobSkills { get; set; }
    public ICollection<Application> Applications { get; set; }
}