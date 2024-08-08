using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebAPI.Controllers;

[Route("files")]
[ApiController]
public class FileController : ControllerBase
{
    private readonly ILocalImageRepository _localImageRepository;
    private readonly ILocalPdfRepository _localPdfRepository;

    public FileController(ILocalImageRepository localImageRepository, ILocalPdfRepository localPdfRepository)
    {
        _localImageRepository = localImageRepository;
        _localPdfRepository = localPdfRepository;
    }

    [HttpPost]
    [Route("images/upload")]
    public async Task<IActionResult> UploadImageAsync(ImageUploadRequestModel request)
    {
        ValidateFileUpload(request.File, [".jpg", ".png", ".jpeg", ".svg"]);

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

    [HttpPost]
    [Route("pdfs/upload")]
    public async Task<IActionResult> UploadPdfAsync(CVUploadRequestModel request)
    {
        ValidateFileUpload(request.File, [".pdf"]);

        if (ModelState.IsValid)
        {
            //Covert DTO to Domain Model

            var pdfDomainModel = new CandidateCV
            {
                CandidateId = request.CandidateId,
                CVName = request.FileName ?? Path.GetFileNameWithoutExtension(request.File.FileName),
                File = request.File,
                FileExtension = Path.GetExtension(request.File.FileName),
                FileSizeInBytes = request.File.Length,
                FileName = request.FileName,
                FileDescription = request.FileDescription
            };

            //User repository to upload image
            await _localPdfRepository.Upload(pdfDomainModel);

            return Ok(pdfDomainModel);
        }
        return BadRequest(ModelState);
    }


    private void ValidateFileUpload(IFormFile file, string[] allowedExtensions)
    {
        if (!allowedExtensions.Contains(Path.GetExtension(file.FileName)))
        {
            ModelState.AddModelError("file", "Unsupported file extension");
        }

        if (file.Length > 10485760)
        {
            ModelState.AddModelError("file", "File size more than 10MB, please upload a smaller size file.");
        }
    }
}