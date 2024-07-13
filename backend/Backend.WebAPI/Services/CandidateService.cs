using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories;
using Backend.WebAPI.Common.CustomException;
using Backend.WebAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.WebAPI.Services;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<Candidate> _passwordHasher;
    private readonly IMapper _mapper;
    public CandidateService(ICandidateRepository candidateRepository, ITokenService tokenService, IMapper mapper)
    {
        _candidateRepository = candidateRepository;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<Candidate>();
        _mapper = mapper;
    }

    public async Task<LoginResponseModel> LoginAsync(LoginRequestModel login)
    {
        var user = await _candidateRepository.GetCandidateByEmail(login.Email);
        var response = new LoginResponseModel();
        if (user == null)
        {
            response.Success = false;
            response.Message = "Invalid username or password";
            return response;
        }
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);
        if (result == PasswordVerificationResult.Success)
        {
            response.Success = true;
            response.Message = "Login successful";
            response.Token = _tokenService.GenerateJWT(user);
        }
        else
        {
            response.Success = false;
            response.Message = "Invalid username or password";
        }
        return response;
    }

    public async Task<IEnumerable<CandidateResponseModel>> GetAllCandidatesAsync()
    {
        var candidates = await _candidateRepository.GetAllAsync();
        return candidates.Select(_mapper.Map<CandidateResponseModel>);
    }

    public async Task<CandidateResponseModel?> GetCandidateByIdAsync(Guid id)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id);
        return _mapper.Map<CandidateResponseModel>(candidate);
    }

    public async Task<CandidateResponseModel> InsertCandidateAsync(CandidateRequestModel candidate)
    {
        // Check if the candidate already exists
        var existingCandidate = await _candidateRepository.GetCandidateByEmail(candidate.Email);
        if (existingCandidate != null)
        {
            throw new UniquePropertyException("Account with this email already exists");
        }
        var newCandidate = _mapper.Map<Candidate>(candidate);
        newCandidate.PasswordHash = _passwordHasher.HashPassword(newCandidate, candidate.Password);
        await _candidateRepository.InsertAsync(newCandidate);
        await _candidateRepository.SaveAsync();
        return _mapper.Map<CandidateResponseModel>(newCandidate);
    }

    public async Task UpdateCandidateAsync(Guid id, CandidateRequestModel candidate)
    {
        var existingCandidate = await _candidateRepository.GetByIdAsync(id);
        if (existingCandidate == null)
        {
            throw new KeyNotFoundException("Candidate not found");
        }
        _mapper.Map(candidate, existingCandidate);
        _candidateRepository.Update(existingCandidate);
        await _candidateRepository.SaveAsync();
    }

    public async Task DeleteCandidateAsync(Guid id)
    {
        await _candidateRepository.DeleteAsync(id);
        await _candidateRepository.SaveAsync();
    }
}