using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Responses;

public class ApplicationResponseModel
{
    public Guid Id { get; set; }
    public CandidateResponseModel Candidate { get; set; }
    public JobResponseModel Job { get; set; }
    public DateTime AppliedAt {get; set;}
    public string CoverLetter {get; set;}
    public string CvUrl {get; set;}
    public ApplicationStatusType Status { get; set;}
}