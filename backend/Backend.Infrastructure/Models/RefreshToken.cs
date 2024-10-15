namespace Backend.Infrastructure.Models;

public class RefreshToken : BaseModel {
    public string Token { get; set;}
    public DateTime Expires { get; set; }
    public Guid UserId {get; set;}
}