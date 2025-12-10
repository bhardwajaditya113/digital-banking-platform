using AccountService.Domain.Entities;

namespace AccountService.Domain.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByIdAsync(Guid id);
    Task<Account?> GetByAccountNumberAsync(string accountNumber);
    Task<List<Account>> GetByUserIdAsync(Guid userId);
    Task<Account> CreateAsync(Account account);
    Task<Account> UpdateAsync(Account account);
    Task<bool> DeleteAsync(Guid id);
}


