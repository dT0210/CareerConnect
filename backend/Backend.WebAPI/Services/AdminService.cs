using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.Infrastructure.Repositories;
using Backend.WebAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.WebAPI.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<Admin> _passwordHasher;
    private readonly IMapper _mapper;
    public AdminService(IAdminRepository adminRepository, ITokenService tokenService, IMapper mapper)
    {
        _adminRepository = adminRepository;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<Admin>();
        _mapper = mapper;
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

    public Task ApproveCompanyAsync(Guid approverId, Guid companyId)
    {
        throw new NotImplementedException();
    }
}