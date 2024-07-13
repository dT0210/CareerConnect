using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public interface IRecruiterRepository : IGenericRepository<Recruiter>
{
    Task<Recruiter> GetRecruiterByEmail(string email);
}