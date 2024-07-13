using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories;
using Backend.WebAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.WebAPI.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IRecruiterRepository _recruiterRepository;
    private readonly IMapper _mapper;
    public CompanyService(ICompanyRepository companyRepository, IRecruiterRepository recruiterRepository, ITokenService tokenService, IMapper mapper)
    {
        _companyRepository = companyRepository;
        _recruiterRepository = recruiterRepository;
        _mapper = mapper;
    }


    public async Task<IEnumerable<CompanyResponseModel>> GetAllCompanysAsync()
    {
        var companys = await _companyRepository.GetAllAsync();
        return companys.Select(_mapper.Map<CompanyResponseModel>);
    }

    public async Task<CompanyResponseModel?> GetCompanyByIdAsync(Guid id)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        return _mapper.Map<CompanyResponseModel>(company);
    }

    public async Task<CompanyResponseModel> InsertCompanyAsync(CompanyRequestModel company)
    {
        var recruiter = await _recruiterRepository.GetByIdAsync(company.RecruiterId);
        if (recruiter == null)
        {
            throw new KeyNotFoundException("Recruiter not found");
        }
        var newCompany = _mapper.Map<Company>(company);
        await _companyRepository.InsertAsync(newCompany);
        await _companyRepository.SaveAsync();
        recruiter.CompanyId = newCompany.Id;
        return _mapper.Map<CompanyResponseModel>(newCompany);
    }

    public async Task UpdateCompanyAsync(Guid id, CompanyRequestModel company)
    {
        var existingCompany = await _companyRepository.GetByIdAsync(id);
        if (existingCompany == null)
        {
            throw new KeyNotFoundException("Company not found");
        }
        _mapper.Map(company, existingCompany);
        _companyRepository.Update(existingCompany);
        await _companyRepository.SaveAsync();
    }

    public async Task DeleteCompanyAsync(Guid id)
    {
        await _companyRepository.DeleteAsync(id);
        await _companyRepository.SaveAsync();
    }

    public async Task ApproveCompanyAsync(Guid companyId, Guid adminId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }
        company.Approved = true;
        company.ApproverId = adminId;
        _companyRepository.Update(company);
        await _companyRepository.SaveAsync();
    }
}