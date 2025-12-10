using InvestmentService.Domain.Entities;

namespace InvestmentService.Domain.Repositories;

public interface IPortfolioRepository
{
    Task<Portfolio?> GetByIdAsync(Guid id);
    Task<List<Portfolio>> GetByUserIdAsync(Guid userId);
    Task<Portfolio> CreateAsync(Portfolio portfolio);
    Task<Portfolio> UpdateAsync(Portfolio portfolio);
}


