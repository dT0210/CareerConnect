using Backend.Infrastructure.Models;

namespace Backend.Infrastructure.Repositories.Interfaces;

public interface ILocalPdfRepository
{
    Task<CandidateCV> Upload(CandidateCV image);
}