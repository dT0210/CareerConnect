using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[Route("images")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly ILocalImageRepository _localImageRepository;

    public ImagesController(ILocalImageRepository localImageRepository)
    {
        _localImageRepository = localImageRepository;
    }

    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> UploadImageAsync(ImageUploadRequestModel request)
    {
        ValidateFileUpload(request);

        if (ModelState.IsValid)
        {
            //Covert DTO to Domain Model

            var imageDomainModel = new Image
            {
                File = request.File,
                FileExtension = Path.GetExtension(request.File.FileName),
                FileSizeInBytes = request.File.Length,
                FileName = request.FileName,
                FileDescription = request.FileDescription
            };

            //User repository to upload image
            await _localImageRepository.Upload(imageDomainModel);

            return Ok(imageDomainModel);
        }
        return BadRequest(ModelState);
    }

    private void ValidateFileUpload(ImageUploadRequestModel request)
    {
        var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
        if (!allowedExtensions.Contains(Path.GetExtension(request.File.FileName)))
        {
            ModelState.AddModelError("file", "Unsupported file extension");
        }

        if (request.File.Length > 10485760)
        {
            ModelState.AddModelError("file", "File size more than 10MB, please upload a smaller size file.");
        }
    }
}