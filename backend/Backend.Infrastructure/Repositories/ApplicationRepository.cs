using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
{
    public ApplicationRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}