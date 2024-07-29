namespace Backend.WebAPI.Models.Requests;

public class CompanyRequestModel
{
    public Guid RecruiterId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Size { get; set; }
    public string Website { get; set; }
}