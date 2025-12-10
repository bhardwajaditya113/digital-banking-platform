using Shared.Kernel.Entities;

namespace TransactionService.Domain.Entities;

public class Transaction : BaseEntity
{
    public Guid FromAccountId { get; set; }
    public Guid? ToAccountId { get; set; }
    public string TransactionType { get; set; } = string.Empty; // Transfer, Deposit, Withdrawal, Payment
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Processing, Completed, Failed, Cancelled
    public string? Description { get; set; }
    public string? ReferenceNumber { get; set; }
    public decimal? Fee { get; set; }
    public string? FailureReason { get; set; }
    public DateTime? ProcessedAt { get; set; }
}


