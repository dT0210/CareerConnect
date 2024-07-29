using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class AdminRepository : GenericRepository<Admin>, IAdminRepository
{
    public AdminRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }

    public async Task<Admin> GetAdminByEmail(string email)
    {
        return await _dbContext.Admins.FirstOrDefaultAsync(a => a.Email == email);
    }
}