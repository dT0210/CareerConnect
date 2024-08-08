using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public Job Job { get; set; }
    public Candidate Candidate { get; set; }
}