namespace Backend.WebAPI.Models;

public class RecruiterResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public CompanyResponseModel? Company { get; set; }
}