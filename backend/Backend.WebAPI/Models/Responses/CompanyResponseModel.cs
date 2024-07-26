using Backend.Shared.Enum;

namespace Backend.WebAPI.Models;

public class CompanyResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Size { get; set; }
    public string Website { get; set; }
    public CompanyStatusType Status { get; set; }
    public DateTime RequestedAt { get; set; }
    public Guid RecruiterId { get; set; }
}