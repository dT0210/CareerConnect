using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface IRecruiterRepository : IGenericRepository<Recruiter>
{
    Task<Recruiter> GetRecruiterByEmail(string email);
}