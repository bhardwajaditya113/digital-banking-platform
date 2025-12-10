using InvestmentService.Domain.Entities;
using InvestmentService.Domain.Repositories;
using InvestmentService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InvestmentService.Infrastructure.Repositories;

public class PortfolioRepository : IPortfolioRepository
{
    private readonly InvestmentDbContext _context;

    public PortfolioRepository(InvestmentDbContext context)
    {
        _context = context;
    }

    public async Task<Portfolio?> GetByIdAsync(Guid id)
    {
        return await _context.Portfolios
            .Include(p => p.Investments)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
    }

    public async Task<List<Portfolio>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Portfolios
            .Include(p => p.Investments)
            .Where(p => p.UserId == userId && !p.IsDeleted)
            .ToListAsync();
    }

    public async Task<Portfolio> CreateAsync(Portfolio portfolio)
    {
        await _context.Portfolios.AddAsync(portfolio);
        await _context.SaveChangesAsync();
        return portfolio;
    }

    public async Task<Portfolio> UpdateAsync(Portfolio portfolio)
    {
        portfolio.UpdatedAt = DateTime.UtcNow;
        _context.Portfolios.Update(portfolio);
        await _context.SaveChangesAsync();
        return portfolio;
    }
}


