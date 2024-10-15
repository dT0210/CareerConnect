using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }

    public async Task<User> GetUserByEmail(string email)
    {
        return await _dbContext.Set<User>().FirstOrDefaultAsync(c => c.Email == email);
    }
}