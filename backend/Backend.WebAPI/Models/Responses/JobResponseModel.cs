using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Responses;


public class JobResponseModel
{
    public Guid Id { get; set; }
    public RecruiterResponseModel Recruiter { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Field { get; set; }
    public DateTime Deadline { get; set; }
    public JobType Type { get; set; }
    public string Salary { get; set; }
    public string Experience { get; set; }
    public ICollection<SkillResponseModel> Skills { get; set; }
}