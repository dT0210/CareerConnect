using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface ILocalImageRepository
{
    Task<Image> Upload(Image image);
}