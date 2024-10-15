namespace Backend.WebAPI.Models.Requests;
using System.ComponentModel.DataAnnotations;

public class CandidateUpdateRequestModel
{
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
}