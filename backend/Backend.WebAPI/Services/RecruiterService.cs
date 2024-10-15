using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Common.CustomException;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class RecruiterService : IRecruiterService
{
    private readonly IRecruiterRepository _recruiterRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<Recruiter> _passwordHasher;
    private readonly IMapper _mapper;
    public RecruiterService(IRecruiterRepository recruiterRepository, ICompanyRepository companyRepository, ITokenService tokenService, IMapper mapper)
    {
        _recruiterRepository = recruiterRepository;
        _companyRepository = companyRepository;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<Recruiter>();
        _mapper = mapper;
    }

    public async Task<LoginResponseModel> LoginAsync(LoginRequestModel login)
    {
        var user = await _recruiterRepository.GetRecruiterByEmail(login.Email);
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

    public async Task<IEnumerable<RecruiterResponseModel>> GetAllRecruitersAsync()
    {
        var recruiters = await _recruiterRepository.GetAllQueryable().Include(r => r.Company).ToListAsync();
        return recruiters.Select(_mapper.Map<RecruiterResponseModel>);
    }

    public async Task<RecruiterResponseModel?> GetRecruiterByIdAsync(Guid id)
    {
        var recruiter = await _recruiterRepository.GetAllQueryable()
                        .Include(r => r.Company)
                        .Where(r => r.Id == id)
                        .FirstOrDefaultAsync();
        if (recruiter == null) throw new KeyNotFoundException("Recruiter not found");

        return _mapper.Map<RecruiterResponseModel>(recruiter);
    }

    public async Task<RecruiterResponseModel> InsertRecruiterAsync(RecruiterRequestModel recruiter)
    {
        var existingRecruiter = await _recruiterRepository.GetRecruiterByEmail(recruiter.Email);
        if (existingRecruiter != null) throw new UniquePropertyException("Account with this email already exists");
        var newRecruiter = _mapper.Map<Recruiter>(recruiter);
        newRecruiter.PasswordHash = _passwordHasher.HashPassword(newRecruiter, recruiter.Password);
        newRecruiter.CreatedAt = DateTime.Now;
        newRecruiter.ModifiedAt = DateTime.Now;
        await _recruiterRepository.InsertAsync(newRecruiter);
        await _recruiterRepository.SaveAsync();
        return _mapper.Map<RecruiterResponseModel>(newRecruiter);
    }

    public async Task UpdateRecruiterAsync(Guid id, RecruiterRequestModel recruiter)
    {
        var existingRecruiter = await _recruiterRepository.GetByIdAsync(id);
        if (existingRecruiter == null)
        {
            throw new KeyNotFoundException("Recruiter not found");
        }
        _mapper.Map(recruiter, existingRecruiter);
        _recruiterRepository.Update(existingRecruiter);
        await _recruiterRepository.SaveAsync();
    }

    public async Task DeleteRecruiterAsync(Guid id)
    {
        await _recruiterRepository.DeleteAsync(id);
        await _recruiterRepository.SaveAsync();
    }

    public async Task CreateCompanyProfileAsync(Guid id, CompanyRequestModel companyProfile)
    {
        var company = _mapper.Map<Company>(companyProfile);
        var recruiter = await _recruiterRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Recruiter not found");

        await _companyRepository.InsertAsync(company);
        await _companyRepository.SaveAsync();
        _recruiterRepository.Update(recruiter);
        await _recruiterRepository.SaveAsync();
    }
}