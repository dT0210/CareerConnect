using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface ICandidateRepository : IGenericRepository<Candidate> {
    Task<Candidate> GetCandidateByEmail(string email);
}