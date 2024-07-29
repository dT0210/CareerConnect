using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.Shared.Enum;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.EntityFrameworkCore;

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


    public async Task<PagedResponse<CompanyResponseModel>> GetAllCompanysAsync(
        int? pageIndex, int? pageSize, CompanyStatusType? status, 
        string? search, string? orderBy, bool? isDescending
    ) {
        var query = _companyRepository.GetAllQueryable().Include(c => c.Recruiter).AsNoTracking();
        string searchPhraseLower = search?.ToLower() ?? string.Empty;

        query = query.Where(x => (status == null || x.Status == status)
                                    && (string.IsNullOrWhiteSpace(searchPhraseLower) || x.Name.Contains(searchPhraseLower))
        );

        var totalRecords = query.Count();

        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Company, object>>>
                {
                    { "name", x => x.Name},
                    { "status",  x => x.Status },
                    { "size", x => x.Size},
                    { "website", x => x.Website },
                    { "requestedAt", x => x.RequestedAt}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the requested date
        else
        {
            query = query.OrderBy(x => x.RequestedAt);
        }
        pageIndex ??= 1;
        pageSize ??= 10;
        var companies = await query
                .Skip((int)((pageIndex - 1) * pageSize))
                .Take((int)pageSize)
                .ToListAsync();

        var response = new PagedResponse<CompanyResponseModel> {
            PageIndex = (int)pageIndex,
            PageSize = (int)pageSize,
            TotalPages = (int)(totalRecords / (double)pageSize),
            TotalRecords = totalRecords,
            Data = companies.Select(_mapper.Map<CompanyResponseModel>).ToList()
        };
        return response;
    }

    public async Task<CompanyResponseModel?> GetCompanyByIdAsync(Guid id)
    {
        var company = await _companyRepository.GetAllQueryable()
                            .Include(c => c.Recruiter)
                            .Where(c => c.Id == id)
                            .FirstOrDefaultAsync();

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
        _recruiterRepository.Update(recruiter);
        await _recruiterRepository.SaveAsync();
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
        existingCompany.ModifiedAt = DateTime.Now;
        existingCompany.Status = CompanyStatusType.Waiting;
        existingCompany.RequestedAt = DateTime.Now;
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
        company.Status = CompanyStatusType.Approved;
        company.ApproverId = adminId;
        company.ModifiedAt = DateTime.Now;
        _companyRepository.Update(company);
        await _companyRepository.SaveAsync();
    }

    public async Task RejectCompanyAsync(Guid companyId, Guid adminId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }
        company.Status = CompanyStatusType.Rejected;
        company.ApproverId = adminId;
        company.ModifiedAt = DateTime.Now;
        _companyRepository.Update(company);
        await _companyRepository.SaveAsync();
    }
}