using Microsoft.EntityFrameworkCore;
using TransactionService.Domain.Entities;

namespace TransactionService.Infrastructure.Data;

public class TransactionDbContext : DbContext
{
    public TransactionDbContext(DbContextOptions<TransactionDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.FromAccountId);
            entity.HasIndex(e => e.ToAccountId);
            entity.HasIndex(e => e.ReferenceNumber);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Fee).HasPrecision(18, 2);
        });
    }
}


