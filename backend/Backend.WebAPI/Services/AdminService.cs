using System.Linq.Expressions;
using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebAPI.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<Admin> _passwordHasher;
    private readonly IMapper _mapper;
    private readonly IFieldRepository _fieldRepository;
    public AdminService(IAdminRepository adminRepository, ITokenService tokenService, IMapper mapper, IFieldRepository fieldRepository)
    {
        _adminRepository = adminRepository;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<Admin>();
        _mapper = mapper;
        _fieldRepository = fieldRepository;
    }

    public async Task<LoginResponseModel> LoginAsync(LoginRequestModel login)
    {
        var user = await _adminRepository.GetAdminByEmail(login.Email);
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

    public async Task<IEnumerable<AdminResponseModel>> GetAllAdminsAsync()
    {
        var admins = await _adminRepository.GetAllAsync();
        return admins.Select(_mapper.Map<AdminResponseModel>);
    }

    public async Task<AdminResponseModel?> GetAdminByIdAsync(Guid id)
    {
        var admin = await _adminRepository.GetByIdAsync(id);
        return _mapper.Map<AdminResponseModel>(admin);
    }

    public async Task<AdminResponseModel> InsertAdminAsync(AdminRequestModel admin)
    {
        var newAdmin = _mapper.Map<Admin>(admin);
        newAdmin.PasswordHash = _passwordHasher.HashPassword(newAdmin, admin.Password);
        await _adminRepository.InsertAsync(newAdmin);
        await _adminRepository.SaveAsync();
        return _mapper.Map<AdminResponseModel>(newAdmin);
    }

    public async Task UpdateAdminAsync(Guid id, AdminRequestModel admin)
    {
        var existingAdmin = await _adminRepository.GetByIdAsync(id);
        if (existingAdmin == null)
        {
            throw new KeyNotFoundException("Admin not found");
        }
        _mapper.Map(admin, existingAdmin);
        _adminRepository.Update(existingAdmin);
        await _adminRepository.SaveAsync();
    }

    public async Task DeleteAdminAsync(Guid id)
    {
        await _adminRepository.DeleteAsync(id);
        await _adminRepository.SaveAsync();
    }

    public async Task<PagedResponse<FieldStatisticResponseModel>> GetFieldsStatisticsAsync(int? pageIndex, int? pageSize, string? orderBy, bool? isDescending, string? search)
    {
        string searchPhraseLower = search?.ToLower() ?? string.Empty;

        var query = _fieldRepository.GetAllQueryable()
            .Include(field => field.Jobs)
            .ThenInclude(job => job.Applications)
            .AsNoTracking();

        // Filtering by search phrase
        query = query.Where(x => string.IsNullOrWhiteSpace(searchPhraseLower) || x.Name.ToLower().Contains(searchPhraseLower));

        // Count total records asynchronously
        var totalRecords = await query.CountAsync();

        // Ordering logic
        if (!string.IsNullOrEmpty(orderBy))
        {
            var columnsSelector = new Dictionary<string, Expression<Func<Field, object>>>
                {
                    { "name", x => x.Name},
                    { "createdAt", x => x.CreatedAt},
                    { "modifiedAt", x => x.ModifiedAt},
                    {"jobCount", x => x.Jobs.Count},
                    {"applicationCount", x => x.Jobs.SelectMany(job => job.Applications).Count()}
                };
            var selectedColumn = columnsSelector[orderBy];
            query = isDescending.HasValue && isDescending.Value
                ? query.OrderByDescending(selectedColumn)
                : query.OrderBy(selectedColumn);
        }
        //else default sort by the created date
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        // Apply pagination
        if (pageSize.HasValue && pageIndex.HasValue)
        {
            query = query.Skip((int)((pageIndex - 1) * pageSize)).Take((int)pageSize);
        }

        // Project directly into FieldStatisticResponseModel
        var fields = await query.Select(field => new FieldStatisticResponseModel
        {
            Id = field.Id,
            Name = field.Name,
            JobCount = field.Jobs.Count,
            ApplicationCount = field.Jobs.SelectMany(job => job.Applications).Count()
        }).ToListAsync();

        // Create paged response
        var response = new PagedResponse<FieldStatisticResponseModel>
        {
            PageIndex = pageIndex ?? 1,
            PageSize = pageSize ?? totalRecords,
            TotalPages = (int)Math.Ceiling(totalRecords / (double)(pageSize ?? 1)),
            TotalRecords = totalRecords,
            Data = fields
        };

        return response;
    }

}