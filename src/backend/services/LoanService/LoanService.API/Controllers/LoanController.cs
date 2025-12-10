using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Kernel.Common;
using System.Security.Claims;

namespace LoanService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoanController : ControllerBase
{
    private readonly ILoanRepository _loanRepository;
    private readonly CreateLoanCommandHandler _createLoanHandler;
    private readonly ILogger<LoanController> _logger;

    public LoanController(
        ILoanRepository loanRepository,
        CreateLoanCommandHandler createLoanHandler,
        ILogger<LoanController> logger)
    {
        _loanRepository = loanRepository;
        _createLoanHandler = createLoanHandler;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(LoanDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateLoan([FromBody] CreateLoanRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            return Unauthorized();
        }

        request.UserId = userIdGuid;
        var command = new CreateLoanCommand { Request = request };
        var result = await _createLoanHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetLoan), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(LoanDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLoan(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null)
        {
            return NotFound();
        }

        var loanDto = new LoanDto
        {
            Id = loan.Id,
            UserId = loan.UserId,
            LoanNumber = loan.LoanNumber,
            LoanType = loan.LoanType,
            PrincipalAmount = loan.PrincipalAmount,
            InterestRate = loan.InterestRate,
            TermMonths = loan.TermMonths,
            MonthlyPayment = loan.MonthlyPayment,
            RemainingBalance = loan.RemainingBalance,
            Status = loan.Status,
            ApprovedDate = loan.ApprovedDate,
            MaturityDate = loan.MaturityDate,
            Payments = loan.Payments.Select(p => new LoanPaymentDto
            {
                Id = p.Id,
                Amount = p.Amount,
                PaymentDate = p.PaymentDate,
                PaymentType = p.PaymentType,
                Status = p.Status
            }).ToList()
        };

        return Ok(loanDto);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(List<LoanDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserLoans(Guid userId)
    {
        var loans = await _loanRepository.GetByUserIdAsync(userId);
        var loanDtos = loans.Select(l => new LoanDto
        {
            Id = l.Id,
            UserId = l.UserId,
            LoanNumber = l.LoanNumber,
            LoanType = l.LoanType,
            PrincipalAmount = l.PrincipalAmount,
            InterestRate = l.InterestRate,
            TermMonths = l.TermMonths,
            MonthlyPayment = l.MonthlyPayment,
            RemainingBalance = l.RemainingBalance,
            Status = l.Status,
            ApprovedDate = l.ApprovedDate,
            MaturityDate = l.MaturityDate,
            Payments = l.Payments.Select(p => new LoanPaymentDto
            {
                Id = p.Id,
                Amount = p.Amount,
                PaymentDate = p.PaymentDate,
                PaymentType = p.PaymentType,
                Status = p.Status
            }).ToList()
        }).ToList();

        return Ok(loanDtos);
    }
}


