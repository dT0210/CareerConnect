using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
{
    public CompanyRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}