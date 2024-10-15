using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.Infrastructure.Models;

[Table("Applications")]
public class Application : BaseModel
{
    [Required]
    public Guid JobId { get; set; }
    [Required]
    public Guid CandidateId { get; set; }
    public string CoverLetter {get;set;}
    public string? CvUrl {get;set;}
    public ApplicationStatusType Status {get; set;} = ApplicationStatusType.Sent;

    public Job Job { get; set; }
    public User Candidate { get; set; }
}