using AutoMapper;
using Backend.Infrastructure.Models;
using Backend.WebAPI.Models.Requests;
using Backend.WebAPI.Models.Responses;

namespace Backend.WebAPI.Common.AutoMapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<Candidate, CandidateResponseModel>();

        CreateMap<CandidateRequestModel, Candidate>();

        CreateMap<CandidateUpdateRequestModel, Candidate>();

        CreateMap<User, UserResponseModel>();

        CreateMap<UserRequestModel, User>();

        CreateMap<UserUpdateRequestModel, User>();

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
            )
            .ForMember(
                dest => dest.Applications,
                opt => opt.MapFrom(src => src.Applications.Count())
            )
            .ForMember(
                dest => dest.IsDeleted,
                opt => opt.MapFrom(src => src.DeletedBy != null)
            );

        CreateMap<JobRequestModel, Job>();

        CreateMap<Skill, SkillResponseModel>();

        CreateMap<SkillRequestModel, Skill>();

        CreateMap<Application, ApplicationResponseModel>().ForMember(
            dest => dest.AppliedAt,
            opt => opt.MapFrom(src => src.CreatedAt)
        );

        CreateMap<ApplicationRequestModel, Application>();

        CreateMap<FieldRequestModel, Field>();

        CreateMap<Field, FieldResponseModel>();

        CreateMap<Notification, NotificationResponseModel>();

        CreateMap<ReportRequestModel, Report>();

        CreateMap<Report, ReportResponseModel>();
    }
}