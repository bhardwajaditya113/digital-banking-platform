using AccountService.Domain.Entities;
using AccountService.Domain.Repositories;
using AccountService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AccountService.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly AccountDbContext _context;

    public AccountRepository(AccountDbContext context)
    {
        _context = context;
    }

    public async Task<Account?> GetByIdAsync(Guid id)
    {
        return await _context.Accounts
            .Include(a => a.Wallets)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
    }

    public async Task<Account?> GetByAccountNumberAsync(string accountNumber)
    {
        return await _context.Accounts
            .Include(a => a.Wallets)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber && !a.IsDeleted);
    }

    public async Task<List<Account>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Accounts
            .Include(a => a.Wallets)
            .Where(a => a.UserId == userId && !a.IsDeleted)
            .ToListAsync();
    }

    public async Task<Account> CreateAsync(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        account.UpdatedAt = DateTime.UtcNow;
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var account = await GetByIdAsync(id);
        if (account == null) return false;

        account.IsDeleted = true;
        account.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}


