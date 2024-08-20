using Microsoft.AspNetCore.SignalR;

namespace Backend.WebAPI.Hubs;

public class NotificationsHub : Hub {
    public override async Task OnConnectedAsync() {

        await base.OnConnectedAsync();
    }

    public async Task SendNotification(string userId, string message)
    {
        // Send the notification to a specific user
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }
}