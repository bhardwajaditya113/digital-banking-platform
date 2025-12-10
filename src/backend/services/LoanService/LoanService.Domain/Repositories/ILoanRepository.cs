using LoanService.Domain.Entities;

namespace LoanService.Domain.Repositories;

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(Guid id);
    Task<Loan?> GetByLoanNumberAsync(string loanNumber);
    Task<List<Loan>> GetByUserIdAsync(Guid userId);
    Task<Loan> CreateAsync(Loan loan);
    Task<Loan> UpdateAsync(Loan loan);
}


