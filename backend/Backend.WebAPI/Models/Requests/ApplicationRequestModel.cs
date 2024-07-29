namespace Backend.WebAPI.Models.Requests;

public class ApplicationRequestModel
{
    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }
    public DateTime AppliedAt { get; set; }

}