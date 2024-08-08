using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Backend.Infrastructure.Models;

public class Image : BaseModel
{
    [NotMapped]
    public IFormFile File { get; set; }

    public string FileName { get; set; }
    public string? FileDescription { get; set; }
    public string FileExtension { get; set; }
    public long FileSizeInBytes { get; set; }
    public string FilePath { get; set; }
}