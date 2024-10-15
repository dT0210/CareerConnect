namespace Backend.WebAPI.Models.Responses;

public class FieldStatisticResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int JobCount {get; set; }
    public int ApplicationCount {get; set; }
}