using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.Models;

public class BaseModel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Guid? CreatedBy { get; set; }
    public DateTime? ModifiedAt { get; set; } = DateTime.Now;
    public Guid? ModifiedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}