using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class JobRepository : GenericRepository<Job>, IJobRepository
{
    public JobRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}