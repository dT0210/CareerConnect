using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class CandidateRepository : GenericRepository<Candidate>, ICandidateRepository
{
    public CandidateRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }

    public async Task<Candidate> GetCandidateByEmail(string email)
    {
        return await _dbContext.Set<Candidate>().FirstOrDefaultAsync(c => c.Email == email);
    }
}