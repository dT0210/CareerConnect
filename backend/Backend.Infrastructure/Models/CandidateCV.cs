using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Backend.Infrastructure.Models
{
    [Table("CandidateCVs")]
    public class CandidateCV : BaseModel
    {
        [Required]
        public Guid CandidateId { get; set; }
        public string CVName { get; set; }
        [NotMapped]
        public IFormFile File { get; set; }
        public string FileName { get; set; }
        public string? FileDescription { get; set; }
        public string FileExtension { get; set; }
        public long FileSizeInBytes { get; set; }
        public string FilePath { get; set; }
    }
}
