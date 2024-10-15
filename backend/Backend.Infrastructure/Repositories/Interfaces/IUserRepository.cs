using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface IUserRepository : IGenericRepository<User> {
    Task<User> GetUserByEmail(string email);
}