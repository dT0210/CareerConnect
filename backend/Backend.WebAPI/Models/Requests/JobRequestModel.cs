using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Requests;


public class JobRequestModel
{
    [Required]
    public Guid RecruiterId { get; set; }
    [Required]
    public string Title { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    [Required]
    public Guid FieldId { get; set; }
    [Required]
    public DateTime Deadline { get; set; }
    [Required]
    public JobType Type { get; set; }
    [Required]
    public string Salary { get; set; }
    public string Experience { get; set; }
    public ICollection<Guid>? Skills { get; set; }
}