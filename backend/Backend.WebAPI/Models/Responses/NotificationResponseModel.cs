namespace Backend.WebAPI.Models.Responses;

public class NotificationResponseModel {
    public Guid Id { get; set; }
    public string Message { get; set; }
    public bool IsRead {get; set;}
    public DateTime CreatedAt { get; set;}
}