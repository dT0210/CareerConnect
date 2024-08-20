using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
{
    public NotificationRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}