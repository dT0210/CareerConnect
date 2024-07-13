using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public interface IAdminRepository : IGenericRepository<Admin>
{
    Task<Admin> GetAdminByEmail(string email);
}