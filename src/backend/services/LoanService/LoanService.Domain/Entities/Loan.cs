using Shared.Kernel.Entities;

namespace LoanService.Domain.Entities;

public class Loan : BaseEntity
{
    public Guid UserId { get; set; }
    public string LoanNumber { get; set; } = string.Empty;
    public string LoanType { get; set; } = string.Empty; // Personal, Mortgage, Auto, Business
    public decimal PrincipalAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int TermMonths { get; set; }
    public decimal MonthlyPayment { get; set; }
    public decimal RemainingBalance { get; set; }
    public string Status { get; set; } = string.Empty; // Pending, Approved, Active, PaidOff, Defaulted
    public DateTime? ApprovedDate { get; set; }
    public DateTime? MaturityDate { get; set; }
    public List<LoanPayment> Payments { get; set; } = new();
}

public class LoanPayment : BaseEntity
{
    public Guid LoanId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentType { get; set; } = string.Empty; // Regular, Extra, Final
    public string Status { get; set; } = string.Empty; // Pending, Completed, Failed
    public Loan? Loan { get; set; }
}


