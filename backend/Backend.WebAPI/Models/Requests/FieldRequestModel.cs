using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class FieldRequestModel
{
    [Required]
    public string Name { get; set; }
}