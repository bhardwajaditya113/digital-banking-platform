namespace AccountService.Application.DTOs;

public class CreateAccountRequest
{
    public Guid UserId { get; set; }
    public string AccountType { get; set; } = string.Empty; // Savings, Checking
    public string Currency { get; set; } = "USD";
}

public class AccountDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public decimal AvailableBalance { get; set; }
    public bool IsActive { get; set; }
    public List<WalletDto> Wallets { get; set; } = new();
}

public class WalletDto
{
    public Guid Id { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}


