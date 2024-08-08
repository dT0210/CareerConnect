namespace Backend.WebAPI.Models.Requests;

public class ApplicationRequestModel
{
    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }
    public string CoverLetter {get; set;}
    public string? CvUrl { get; set; }
}