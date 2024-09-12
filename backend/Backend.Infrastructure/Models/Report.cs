using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Reports")]
public class Report : BaseModel
{
    public Guid CandidateId { get; set; }
    public Guid JobId { get; set; }
    public string CandidateComment {get; set;}
    public string AdminComment { get; set;} = "";
    public ReportStatusType Status {get; set;} = ReportStatusType.Waiting;

    public Candidate Candidate { get; set;}
    public Job Job { get; set;}
}