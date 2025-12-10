namespace LoanService.Application.DTOs;

public class CreateLoanRequest
{
    public Guid UserId { get; set; }
    public string LoanType { get; set; } = string.Empty;
    public decimal PrincipalAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int TermMonths { get; set; }
}

public class LoanDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string LoanNumber { get; set; } = string.Empty;
    public string LoanType { get; set; } = string.Empty;
    public decimal PrincipalAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int TermMonths { get; set; }
    public decimal MonthlyPayment { get; set; }
    public decimal RemainingBalance { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ApprovedDate { get; set; }
    public DateTime? MaturityDate { get; set; }
    public List<LoanPaymentDto> Payments { get; set; } = new();
}

public class LoanPaymentDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}


