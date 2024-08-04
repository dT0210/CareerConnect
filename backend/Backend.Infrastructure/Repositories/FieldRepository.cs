using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class FieldRepository : GenericRepository<Field>, IFieldRepository
{
    public FieldRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}