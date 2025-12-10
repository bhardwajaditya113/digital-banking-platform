using TransactionService.Domain.Entities;

namespace TransactionService.Domain.Repositories;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id);
    Task<List<Transaction>> GetByAccountIdAsync(Guid accountId);
    Task<Transaction> CreateAsync(Transaction transaction);
    Task<Transaction> UpdateAsync(Transaction transaction);
}


