using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public class SkillRepository : GenericRepository<Skill>, ISkillRepository
{
    public SkillRepository(CareerConnectContext dbContext) : base(dbContext)
    {
    }
}