namespace Backend.WebAPI.Models.Requests;
using System.ComponentModel.DataAnnotations;

public class UserUpdateRequestModel
{
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
}