using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Hubs;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationsHub> _notificationHubContext;
    private readonly IMapper _mapper;

    public NotificationService(INotificationRepository notificationRepository, IMapper mapper, IHubContext<NotificationsHub> notificationHubContext) {
        _notificationRepository = notificationRepository;
        _notificationHubContext = notificationHubContext;
        _mapper = mapper;
    }
    public async Task<NotificationResponseModel?> GetNotificationByIdAsync(Guid id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Notification not found");
        return _mapper.Map<NotificationResponseModel>(notification);
    }

    public async Task<IEnumerable<NotificationResponseModel>> GetNotificationsAsync(Guid userId, int? limit)
    {
        var query = _notificationRepository.GetAllQueryable()
                            .Where(n => n.UserId == userId);
        if (limit != null) {
            query.Take((int)limit);
        };
        var notifications = await query.ToListAsync();
        return notifications.Select(_mapper.Map<NotificationResponseModel>).ToList();
    }

    public async Task<NotificationResponseModel> InsertNotificationAsync(NotificationRequestModel notification)
    {
        var newNotification = _mapper.Map<Notification>(notification);
        await _notificationRepository.InsertAsync(newNotification);
        await _notificationRepository.SaveAsync();

        await _notificationHubContext.Clients.Users(notification.UserId.ToString()).SendAsync("ReceiveNotification", "You have a new notification");

        return _mapper.Map<NotificationResponseModel>(newNotification);
    }

    public async Task NotificationReadAsync(Guid id) {
        var notification = await _notificationRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Notification not found");
        notification.IsRead = true;
        _notificationRepository.Update(notification);
        await _notificationRepository.SaveAsync();
    }

    public async Task DeleteNotificationAsync(Guid id)
    {
        await _notificationRepository.DeleteAsync(id);
        await _notificationRepository.SaveAsync();
    }
}