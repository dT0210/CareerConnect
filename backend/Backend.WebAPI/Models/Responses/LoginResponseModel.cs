namespace Backend.WebAPI.Models.Responses;

public class LoginResponseModel
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public string Type { get; set;}
}