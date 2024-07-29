using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;

namespace Backend.Infrastructure.Repositories;

public class SkillRepository : GenericRepository<Skill>, ISkillRepository
{
    public SkillRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}