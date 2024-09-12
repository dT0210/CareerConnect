using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class CompanyRequestModel
{
    [Required]
    public Guid RecruiterId { get; set; }
    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address {get;set;}
    public int Size { get; set; }
    public string Website { get; set; }
    public string? ImageUrl {get; set;}
}