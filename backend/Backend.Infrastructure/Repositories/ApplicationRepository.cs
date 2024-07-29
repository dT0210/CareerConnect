using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
{
    public ApplicationRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}