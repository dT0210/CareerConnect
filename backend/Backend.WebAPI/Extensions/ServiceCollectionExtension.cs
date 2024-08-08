using System.Text;
using Backend.Infrastructure;
using Backend.Infrastructure.Repositories;
using Backend.Infrastructure.Repositories.Interfaces;
using Backend.WebAPI.Common.AutoMapper;
using Backend.WebAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Backend.WebAPI.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddControllers();
        services.AddHttpContextAccessor();

        services.AddScoped<ICandidateRepository, CandidateRepository>();
        services.AddScoped<IRecruiterRepository, RecruiterRepository>();
        services.AddScoped<IJobRepository, JobRepository>();
        services.AddScoped<IAdminRepository, AdminRepository>();
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<ISkillRepository, SkillRepository>();
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<ILocalImageRepository, LocalImageRepository>();
        services.AddScoped<ILocalPdfRepository, LocalPdfRepository>();
        services.AddScoped<IFieldRepository, FieldRepository>();

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICandidateService, CandidateService>();
        services.AddScoped<IRecruiterService, RecruiterService>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IJobService, JobService>();
        services.AddScoped<ISkillService, SkillService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IFieldService, FieldService>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JwtSettings:Issuer"],
                ValidAudience = configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]))
            };
        });

        services.AddCors(options =>
        {
            options.AddPolicy(
                name: "MyAllowOrigins",
                policy =>
                {
                    policy.WithOrigins("http://localhost:3000");
                }
            );
            options.AddDefaultPolicy(options =>
            {
                options.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
            });
        });

        services.AddDbContext<CareerConnectContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddAutoMapper(typeof(MapperProfile));

        services.AddSwaggerGen(option =>
        {
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement {
            {
                new OpenApiSecurityScheme {
                    Reference = new OpenApiReference {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }});
        });

        return services;
    }
}