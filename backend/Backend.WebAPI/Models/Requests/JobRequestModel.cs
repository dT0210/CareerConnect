using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.Enum;

namespace Backend.WebAPI.Models.Requests;


public class JobRequestModel
{
    public Guid RecruiterId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Requirements {get; set;}
    public string Location { get; set; }
    public Guid FieldId { get; set; }
    public DateTime Deadline { get; set; }
    public JobType Type { get; set; }
    public string Salary { get; set; }
    public string Experience { get; set; }
    public ICollection<Guid>? Skills { get; set; }
}