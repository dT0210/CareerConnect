

using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class ReportRequestModel
{
    [Required]
    public Guid CandidateId { get; set; }
    [Required]
    public Guid JobId { get; set; }
    public string CandidateComment {get; set;}
}