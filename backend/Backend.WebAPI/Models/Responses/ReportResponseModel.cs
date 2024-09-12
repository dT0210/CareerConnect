

using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Responses;

public class ReportResponseModel
{
    public Guid Id {get; set;}
    public string CandidateComment {get; set;}
    public string AdminComment { get; set;}
    public ReportStatusType Status {get; set;}

    public CandidateResponseModel Candidate { get; set;}
    public JobResponseModel Job { get; set;}
}