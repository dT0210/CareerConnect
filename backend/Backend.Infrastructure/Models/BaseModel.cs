using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.Models;

public class BaseModel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CreatedBy { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public DateTime? ModifiedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public DateTime? DeletedBy { get; set; }
}