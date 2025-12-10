using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using LoanService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LoanService.Infrastructure.Repositories;

public class LoanRepository : ILoanRepository
{
    private readonly LoanDbContext _context;

    public LoanRepository(LoanDbContext context)
    {
        _context = context;
    }

    public async Task<Loan?> GetByIdAsync(Guid id)
    {
        return await _context.Loans
            .Include(l => l.Payments)
            .FirstOrDefaultAsync(l => l.Id == id && !l.IsDeleted);
    }

    public async Task<Loan?> GetByLoanNumberAsync(string loanNumber)
    {
        return await _context.Loans
            .Include(l => l.Payments)
            .FirstOrDefaultAsync(l => l.LoanNumber == loanNumber && !l.IsDeleted);
    }

    public async Task<List<Loan>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Loans
            .Include(l => l.Payments)
            .Where(l => l.UserId == userId && !l.IsDeleted)
            .ToListAsync();
    }

    public async Task<Loan> CreateAsync(Loan loan)
    {
        await _context.Loans.AddAsync(loan);
        await _context.SaveChangesAsync();
        return loan;
    }

    public async Task<Loan> UpdateAsync(Loan loan)
    {
        loan.UpdatedAt = DateTime.UtcNow;
        _context.Loans.Update(loan);
        await _context.SaveChangesAsync();
        return loan;
    }
}


