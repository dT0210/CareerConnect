using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class ApplicationRequestModel
{
    [Required]
    public Guid JobId { get; set; }
    [Required]
    public Guid CandidateId { get; set; }
    public string CoverLetter {get; set;}
    [Required]
    public string? CvUrl { get; set; }
}