namespace TransactionService.Application.DTOs;

public class TransferRequest
{
    public Guid FromAccountId { get; set; }
    public Guid ToAccountId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? Description { get; set; }
}

public class TransactionDto
{
    public Guid Id { get; set; }
    public Guid FromAccountId { get; set; }
    public Guid? ToAccountId { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ReferenceNumber { get; set; }
    public decimal? Fee { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
}


