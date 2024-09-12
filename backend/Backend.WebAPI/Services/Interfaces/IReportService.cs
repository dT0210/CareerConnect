using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface IReportService
{
    Task<PagedResponse<ReportResponseModel>> GetAllReportsAsync(ReportStatusType? status, int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search);
    Task<ReportResponseModel?> GetReportByIdAsync(Guid id);
    Task<ReportResponseModel> InsertReportAsync(ReportRequestModel report);
    Task UpdateReportStatusAsync(Guid id, ReportStatusType status );
    Task DeleteReportAsync(Guid id);
}