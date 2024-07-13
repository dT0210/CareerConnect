using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Skills")]
public class Skill : BaseModel
{
    public string Name { get; set; }

    public ICollection<JobSkill> JobSkills { get; set; }
}