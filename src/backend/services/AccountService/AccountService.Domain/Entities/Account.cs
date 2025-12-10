using Shared.Kernel.Entities;

namespace AccountService.Domain.Entities;

public class Account : BaseEntity
{
    public Guid UserId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty; // Savings, Checking, Investment
    public string Currency { get; set; } = "USD";
    public decimal Balance { get; set; } = 0;
    public decimal AvailableBalance { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public List<Wallet> Wallets { get; set; } = new();
}

public class Wallet : BaseEntity
{
    public Guid AccountId { get; set; }
    public string Currency { get; set; } = string.Empty; // USD, EUR, GBP, AED, etc.
    public decimal Balance { get; set; } = 0;
    public Account? Account { get; set; }
}

public class AccountTransaction : BaseEntity
{
    public Guid AccountId { get; set; }
    public string TransactionType { get; set; } = string.Empty; // Deposit, Withdrawal, Transfer
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Completed, Failed
    public string? Description { get; set; }
    public Guid? RelatedTransactionId { get; set; }
    public Account? Account { get; set; }
}


