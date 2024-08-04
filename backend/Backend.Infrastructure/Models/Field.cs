using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Fields")]
public class Field : BaseModel
{
    public string Name { get; set; }

    public ICollection<Job> Jobs { get; set; }
}