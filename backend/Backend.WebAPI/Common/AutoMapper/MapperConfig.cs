using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.WebAPI.Models;

namespace Backend.WebAPI.Common.AutoMapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<Candidate, CandidateResponseModel>();

        CreateMap<CandidateRequestModel, Candidate>();

        CreateMap<Recruiter, RecruiterResponseModel>();

        CreateMap<RecruiterRequestModel, Recruiter>();

        CreateMap<AdminRequestModel, Admin>();

        CreateMap<Admin, AdminResponseModel>();

        CreateMap<CompanyRequestModel, Company>();

        CreateMap<Company, CompanyResponseModel>();

        CreateMap<Job, JobResponseModel>()
            .ForMember(
                dest => dest.Skills,
                opt => opt.MapFrom(src => src.JobSkills.Select(js => js.Skill))
            );

        CreateMap<JobRequestModel, Job>();

        CreateMap<Skill, SkillResponseModel>();

        CreateMap<SkillRequestModel, Skill>();

        CreateMap<Application, ApplicationResponseModel>();

        CreateMap<ApplicationRequestModel, Application>();
    }
}