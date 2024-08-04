namespace Backend.WebAPI.Models.Responses;

public class ApplicationResponseModel
{
    public CandidateResponseModel Candidate { get; set; }
    public JobResponseModel Job { get; set; }
    public DateTime AppliedAt {get; set;}
    public string CoverLetter {get; set;}
}