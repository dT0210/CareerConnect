using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
{
    public CompanyRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}