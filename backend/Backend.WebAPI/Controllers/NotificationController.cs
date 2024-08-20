using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("notifications")]
public class NotificationController : ControllerBase
{
    private readonly ILogger<NotificationController> _logger;
    private readonly INotificationService _notificationService;

    public NotificationController(ILogger<NotificationController> logger, INotificationService notificationService)
    {
        _logger = logger;
        _notificationService = notificationService;
    }


    [HttpGet]
    [Route("{userId}")]
    public async Task<IActionResult> GetNotificationsByUserIdAsync(Guid userId, int? limit)
    {
        try
        {
            var notifications = await _notificationService.GetNotificationsAsync(userId, limit);
            return Ok(notifications);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}/read")]
    public async Task<IActionResult> NotificationRead(Guid id)
    {
        try
        {
            await _notificationService.NotificationReadAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteNotificationAsync(Guid id)
    {
        try
        {
            await _notificationService.DeleteNotificationAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}