using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public class JobRepository : GenericRepository<Job>, IJobRepository
{
    public JobRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}