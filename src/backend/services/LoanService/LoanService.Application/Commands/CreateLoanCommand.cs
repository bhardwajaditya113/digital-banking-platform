using LoanService.Application.DTOs;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Shared.Kernel.Common;
using Shared.Messaging;

namespace LoanService.Application.Commands;

public class CreateLoanCommand
{
    public CreateLoanRequest Request { get; set; } = new();
}

public class CreateLoanCommandHandler
{
    private readonly ILoanRepository _loanRepository;
    private readonly KafkaProducer _kafkaProducer;
    private readonly ILogger<CreateLoanCommandHandler> _logger;

    public CreateLoanCommandHandler(
        ILoanRepository loanRepository,
        KafkaProducer kafkaProducer,
        ILogger<CreateLoanCommandHandler> logger)
    {
        _loanRepository = loanRepository;
        _kafkaProducer = kafkaProducer;
        _logger = logger;
    }

    public async Task<Result<LoanDto>> Handle(CreateLoanCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        // Calculate monthly payment using amortization formula
        var monthlyRate = request.InterestRate / 100 / 12;
        var monthlyPayment = request.PrincipalAmount * 
            (monthlyRate * Math.Pow(1 + monthlyRate, request.TermMonths)) /
            (Math.Pow(1 + monthlyRate, request.TermMonths) - 1);

        var loan = new Loan
        {
            UserId = request.UserId,
            LoanNumber = GenerateLoanNumber(),
            LoanType = request.LoanType,
            PrincipalAmount = request.PrincipalAmount,
            InterestRate = request.InterestRate,
            TermMonths = request.TermMonths,
            MonthlyPayment = (decimal)monthlyPayment,
            RemainingBalance = request.PrincipalAmount,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        var createdLoan = await _loanRepository.CreateAsync(loan);

        await _kafkaProducer.PublishAsync("loan-created", new
        {
            LoanId = createdLoan.Id,
            UserId = createdLoan.UserId,
            LoanNumber = createdLoan.LoanNumber,
            LoanType = createdLoan.LoanType,
            PrincipalAmount = createdLoan.PrincipalAmount,
            CreatedAt = createdLoan.CreatedAt
        });

        _logger.LogInformation($"Loan created: {createdLoan.LoanNumber} for user {createdLoan.UserId}");

        var loanDto = new LoanDto
        {
            Id = createdLoan.Id,
            UserId = createdLoan.UserId,
            LoanNumber = createdLoan.LoanNumber,
            LoanType = createdLoan.LoanType,
            PrincipalAmount = createdLoan.PrincipalAmount,
            InterestRate = createdLoan.InterestRate,
            TermMonths = createdLoan.TermMonths,
            MonthlyPayment = createdLoan.MonthlyPayment,
            RemainingBalance = createdLoan.RemainingBalance,
            Status = createdLoan.Status,
            ApprovedDate = createdLoan.ApprovedDate,
            MaturityDate = createdLoan.MaturityDate,
            Payments = createdLoan.Payments.Select(p => new LoanPaymentDto
            {
                Id = p.Id,
                Amount = p.Amount,
                PaymentDate = p.PaymentDate,
                PaymentType = p.PaymentType,
                Status = p.Status
            }).ToList()
        };

        return Result<LoanDto>.Success(loanDto);
    }

    private string GenerateLoanNumber()
    {
        return $"LOAN{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}


