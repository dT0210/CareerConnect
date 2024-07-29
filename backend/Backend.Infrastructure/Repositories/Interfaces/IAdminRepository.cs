using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface IAdminRepository : IGenericRepository<Admin>
{
    Task<Admin> GetAdminByEmail(string email);
}