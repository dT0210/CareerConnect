using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories;

public interface ICandidateRepository : IGenericRepository<Candidate> {
    Task<Candidate> GetCandidateByEmail(string email);
}