namespace InvestmentService.Application.DTOs;

public class CreatePortfolioRequest
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class PortfolioDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
    public decimal TotalInvested { get; set; }
    public decimal TotalReturn { get; set; }
    public decimal ReturnPercentage { get; set; }
    public List<InvestmentDto> Investments { get; set; } = new();
}

public class InvestmentDto
{
    public Guid Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string InvestmentType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime PurchaseDate { get; set; }
}


