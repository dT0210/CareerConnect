using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("JobSkill")]
public class JobSkill
{
    public Guid JobId { get; set; }
    public Guid SkillId { get; set; }

    public Job Job { get; set; }
    public Skill Skill { get; set; }
}