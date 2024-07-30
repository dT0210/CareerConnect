using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Responses;

public class CompanyResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Size { get; set; }
    public string Website { get; set; }
    public string ImageUrl {get; set; }
    public CompanyStatusType Status { get; set; }
    public DateTime RequestedAt { get; set; }
    public Guid RecruiterId { get; set; }
}