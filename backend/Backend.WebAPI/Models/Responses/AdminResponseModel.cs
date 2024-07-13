using Backend.Shared.Enum;

namespace Backend.WebAPI.Models;

public class AdminResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public AdminRoleType Role { get; set; }
}