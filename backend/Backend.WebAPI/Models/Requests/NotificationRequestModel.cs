namespace Backend.WebAPI.Models.Requests;

public class NotificationRequestModel {
    public Guid UserId { get; set; }
    public string Message {get; set;}
}