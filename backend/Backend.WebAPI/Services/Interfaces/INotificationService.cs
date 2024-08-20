using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Services;

public interface INotificationService
{
    Task<IEnumerable<NotificationResponseModel>> GetNotificationsAsync(Guid userId, int? limit);
    Task<NotificationResponseModel?> GetNotificationByIdAsync(Guid id);
    Task<NotificationResponseModel> InsertNotificationAsync(NotificationRequestModel notification);
    Task NotificationReadAsync(Guid id);
    Task DeleteNotificationAsync(Guid id);
}