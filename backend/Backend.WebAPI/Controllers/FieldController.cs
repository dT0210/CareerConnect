using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[ApiController]
[Route("fields")]
public class FieldController : ControllerBase
{
    private readonly ILogger<FieldController> _logger;
    private readonly IFieldService _fieldService;

    public FieldController(ILogger<FieldController> logger, IFieldService fieldService)
    {
        _logger = logger;
        _fieldService = fieldService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAllFieldsAsync()
    {
        try
        {
            var users = await _fieldService.GetAllFieldsAsync();
            return Ok(users);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetFieldByIdAsync(Guid id)
    {
        try
        {
            var user = await _fieldService.GetFieldByIdAsync(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdateFieldAsync(Guid id, FieldRequestModel model)
    {
        try
        {
            await _fieldService.UpdateFieldAsync(id, model);
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

    [HttpPost]
    public async Task<IActionResult> CreateFieldAsync(FieldRequestModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        try
        {
            var newField = await _fieldService.InsertFieldAsync(model);
            return Ok(newField);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }

    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteFieldAsync(Guid id)
    {
        try
        {
            await _fieldService.DeleteFieldAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}