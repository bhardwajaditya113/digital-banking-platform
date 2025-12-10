using InvestmentService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvestmentService.Infrastructure.Data;

public class InvestmentDbContext : DbContext
{
    public InvestmentDbContext(DbContextOptions<InvestmentDbContext> options) : base(options)
    {
    }

    public DbSet<Portfolio> Portfolios { get; set; }
    public DbSet<Investment> Investments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Portfolio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.TotalValue).HasPrecision(18, 2);
            entity.Property(e => e.TotalInvested).HasPrecision(18, 2);
            entity.Property(e => e.TotalReturn).HasPrecision(18, 2);
            entity.Property(e => e.ReturnPercentage).HasPrecision(18, 2);
            entity.HasMany(e => e.Investments).WithOne(e => e.Portfolio).HasForeignKey(e => e.PortfolioId);
        });

        modelBuilder.Entity<Investment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PortfolioId);
            entity.Property(e => e.PurchasePrice).HasPrecision(18, 2);
            entity.Property(e => e.CurrentPrice).HasPrecision(18, 2);
            entity.Property(e => e.TotalValue).HasPrecision(18, 2);
        });
    }
}


