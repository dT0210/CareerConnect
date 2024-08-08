using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Backend.Infrastructure.Repositories
{
    public class LocalPdfRepository : ILocalPdfRepository
    {
        private readonly IHostingEnvironment webHostEnvironment;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly CareerConnectContext dbContext;

        public LocalPdfRepository(IHostingEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor,
            CareerConnectContext dbContext)
        {
            this.webHostEnvironment = webHostEnvironment;
            this.httpContextAccessor = httpContextAccessor;
            this.dbContext = dbContext;
        }

        public async Task<CandidateCV> Upload(CandidateCV pdfCV)
        {
            var uniqueFileName = $"{pdfCV.Id}_{pdfCV.FileName}";
            var localFilePath = Path.Combine(webHostEnvironment.ContentRootPath, "CVs", uniqueFileName);

            // Upload PDF to Local Path
            using (var stream = new FileStream(localFilePath, FileMode.Create))
            {
                await pdfCV.File.CopyToAsync(stream);
            }

            // Generate the URL for the uploaded file
            var urlFilePath = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}{httpContextAccessor.HttpContext.Request.PathBase}/CVs/{uniqueFileName}";

            pdfCV.FilePath = urlFilePath;

            // Add CV to CandidateCVs table
            await dbContext.CandidateCVs.AddAsync(pdfCV);
            await dbContext.SaveChangesAsync();

            return pdfCV;
        }
    }
}
