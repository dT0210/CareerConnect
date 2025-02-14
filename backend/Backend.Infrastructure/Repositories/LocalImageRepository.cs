using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Repositories
{
    public class LocalImageRepository : ILocalImageRepository
    {
        private readonly IHostingEnvironment webHostEnvironment;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly CareerConnectContext dbContext;

        public LocalImageRepository(IHostingEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor,
            CareerConnectContext dbContext)
        {
            this.webHostEnvironment = webHostEnvironment;
            this.httpContextAccessor = httpContextAccessor;
            this.dbContext = dbContext;
        }

        public async Task<Image> Upload(Image image)
        {
            var uniqueFileName = $"{image.Id}_{image.FileName}";
            var localFilePath = Path.Combine(webHostEnvironment.ContentRootPath, "Images", uniqueFileName);

            // Upload Image to Local Path
            using (var stream = new FileStream(localFilePath, FileMode.Create))
            {
                await image.File.CopyToAsync(stream);
            }

            // Generate the URL for the uploaded file
            var urlFilePath = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}{httpContextAccessor.HttpContext.Request.PathBase}/Images/{uniqueFileName}";

            image.FilePath = urlFilePath;

            // Add image to Images table
            await dbContext.Images.AddAsync(image);
            await dbContext.SaveChangesAsync();

            return image;
        }
    }
}
