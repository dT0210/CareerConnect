namespace Backend.WebAPI.Models.Responses;

public class PagedResponse<T> {
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalRecords { get; set; }
    public List<T> Data { get; set; }
}