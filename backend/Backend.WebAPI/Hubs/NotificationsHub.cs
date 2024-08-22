using Microsoft.AspNetCore.SignalR;

namespace Backend.WebAPI.Hubs;

public class NotificationsHub : Hub {
    public override async Task OnConnectedAsync() {

        await base.OnConnectedAsync();
    }
}