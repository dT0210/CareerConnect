using Backend.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class RecruiterRepository : GenericRepository<Recruiter>, IRecruiterRepository
{
    public RecruiterRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }

    public async Task<Recruiter> GetRecruiterByEmail(string email)
    {
        return await _dbContext.Set<Recruiter>().FirstOrDefaultAsync(c => c.Email == email);
    }

}