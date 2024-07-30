using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Backend.Infrastructure.Repositories;

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
            var localFilePath = Path.Combine(webHostEnvironment.ContentRootPath, "Images",
                $"{image.FileName}");
            //string otherPath = "D:\\DEV\\Udemy\\Project\\NZWalks\\WebApplication1\\";
            //var localFilePath = Path.Combine(otherPath, "Images",
            //    $"{image.FileName}{image.FileExtension}");

            //Upload Image to Local Path
            using var stream = new FileStream(localFilePath, FileMode.Create);
            await image.File.CopyToAsync(stream);

            // https://localhost:1234/images/image.jpg
            var urlFilePath = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}{httpContextAccessor.HttpContext.Request.PathBase}/Images/{image.FileName}";
            //var urlFilePath = $"http://localhost:5000/Images/{image.FileName}{image.FileExtension}";

            image.FilePath = urlFilePath;

            //Add image to Images table
            await dbContext.Images.AddAsync(image);
            await dbContext.SaveChangesAsync();

            return image;
        }
    }