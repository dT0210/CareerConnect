
using Backend.Infrastructure.Models;
using Backend.Shared.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure;

public class CareerConnectContext : DbContext
{
    private readonly PasswordHasher<Admin> _passwordHasher = new PasswordHasher<Admin>();
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Recruiter> Recruiters { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Field> Fields { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<JobSkill> JobSkills { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<CandidateCV> CandidateCVs { get; set;}
    public DbSet<Notification> Notifications { get; set; }

    public CareerConnectContext(DbContextOptions<CareerConnectContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>()
            .HasOne(c => c.Recruiter)
            .WithOne(r => r.Company)
            .HasForeignKey<Recruiter>(r => r.CompanyId);

        modelBuilder.Entity<Company>()
            .HasOne(c => c.Approver)
            .WithMany(a => a.ApprovedCompanies)
            .HasForeignKey(c => c.ApproverId);

        modelBuilder.Entity<Candidate>()
            .HasIndex(c => c.Email)
            .IsUnique();

        modelBuilder.Entity<Candidate>()
            .HasMany(c => c.AppliedApplications)
            .WithOne(a => a.Candidate)
            .HasForeignKey(a => a.CandidateId);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Recruiter)
            .WithMany(r => r.JobsPosted)
            .HasForeignKey(j => j.RecruiterId);

        modelBuilder.Entity<Job>()
            .HasMany(j => j.Applications)
            .WithOne(a => a.Job)
            .HasForeignKey(a => a.JobId);

        modelBuilder.Entity<JobSkill>()
            .HasOne(js => js.Job)
            .WithMany(j => j.JobSkills)
            .HasForeignKey(js => js.JobId);

        modelBuilder.Entity<JobSkill>()
            .HasOne(js => js.Skill)
            .WithMany(s => s.JobSkills)
            .HasForeignKey(js => js.SkillId);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.Candidate)
            .WithMany(c => c.AppliedApplications)
            .HasForeignKey(a => a.CandidateId);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.Job)
            .WithMany(j => j.Applications)
            .HasForeignKey(a => a.JobId);

        modelBuilder.Entity<JobSkill>()
            .HasKey(js => new { js.JobId, js.SkillId });

        // SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var admin = new Admin
        {
            Id = Guid.NewGuid(),
            Name = "First admin",
            Email = "admin@gmail.com",
            Role = AdminRoleType.Super,
        };
        admin.PasswordHash = _passwordHasher.HashPassword(admin, "adminpassword");
        admin.CreatedAt = DateTime.Now;
        admin.ModifiedAt = DateTime.Now;
        admin.CreatedBy = admin.Id;
        admin.ModifiedBy = admin.Id;

        modelBuilder.Entity<Admin>().HasData(admin);
    }
}