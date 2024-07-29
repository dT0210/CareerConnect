using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class ImageUploadRequestModel
    {
        [Required]
        public IFormFile File { get; set; }

        [Required]
        public string FileName { get; set; }

        public string? FileDescription { get; set; }
    }