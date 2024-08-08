using System.ComponentModel.DataAnnotations;

namespace Backend.WebAPI.Models.Requests;

public class CVUploadRequestModel
    {
        [Required]
        public Guid CandidateId {get; set;}
        [Required]
        public IFormFile File { get; set; }

        [Required]
        public string FileName { get; set; }

        public string? FileDescription { get; set; }
    }