using Shared.Kernel.Entities;

namespace InvestmentService.Domain.Entities;

public class Portfolio : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TotalValue { get; set; } = 0;
    public decimal TotalInvested { get; set; } = 0;
    public decimal TotalReturn { get; set; } = 0;
    public decimal ReturnPercentage { get; set; } = 0;
    public List<Investment> Investments { get; set; } = new();
}

public class Investment : BaseEntity
{
    public Guid PortfolioId { get; set; }
    public string Symbol { get; set; } = string.Empty; // Stock symbol, ETF, etc.
    public string InvestmentType { get; set; } = string.Empty; // Stock, Bond, ETF, Mutual Fund
    public int Quantity { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime PurchaseDate { get; set; }
    public Portfolio? Portfolio { get; set; }
}


