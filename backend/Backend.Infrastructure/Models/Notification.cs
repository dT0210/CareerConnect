using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Infrastructure.Models;

[Table("Notifications")]
public class Notification : BaseModel
{
    public Guid UserId { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; } = false;
}