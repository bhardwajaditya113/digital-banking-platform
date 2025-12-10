using LoanService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LoanService.Infrastructure.Data;

public class LoanDbContext : DbContext
{
    public LoanDbContext(DbContextOptions<LoanDbContext> options) : base(options)
    {
    }

    public DbSet<Loan> Loans { get; set; }
    public DbSet<LoanPayment> LoanPayments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LoanNumber).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.PrincipalAmount).HasPrecision(18, 2);
            entity.Property(e => e.InterestRate).HasPrecision(18, 4);
            entity.Property(e => e.MonthlyPayment).HasPrecision(18, 2);
            entity.Property(e => e.RemainingBalance).HasPrecision(18, 2);
            entity.HasMany(e => e.Payments).WithOne(e => e.Loan).HasForeignKey(e => e.LoanId);
        });

        modelBuilder.Entity<LoanPayment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LoanId);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
        });
    }
}


