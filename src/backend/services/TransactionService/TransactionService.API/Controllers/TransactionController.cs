using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Kernel.Common;
using System.Security.Claims;
using TransactionService.Application.Commands;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Repositories;

namespace TransactionService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly TransferCommandHandler _transferHandler;
    private readonly ILogger<TransactionController> _logger;

    public TransactionController(
        ITransactionRepository transactionRepository,
        TransferCommandHandler transferHandler,
        ILogger<TransactionController> logger)
    {
        _transactionRepository = transactionRepository;
        _transferHandler = transferHandler;
        _logger = logger;
    }

    [HttpPost("transfer")]
    [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
    {
        var command = new TransferCommand { Request = request };
        var result = await _transferHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetTransaction), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTransaction(Guid id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        var transactionDto = new TransactionDto
        {
            Id = transaction.Id,
            FromAccountId = transaction.FromAccountId,
            ToAccountId = transaction.ToAccountId,
            TransactionType = transaction.TransactionType,
            Amount = transaction.Amount,
            Currency = transaction.Currency,
            Status = transaction.Status,
            Description = transaction.Description,
            ReferenceNumber = transaction.ReferenceNumber,
            Fee = transaction.Fee,
            CreatedAt = transaction.CreatedAt,
            ProcessedAt = transaction.ProcessedAt
        };

        return Ok(transactionDto);
    }

    [HttpGet("account/{accountId}")]
    [ProducesResponseType(typeof(List<TransactionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAccountTransactions(Guid accountId)
    {
        var transactions = await _transactionRepository.GetByAccountIdAsync(accountId);
        var transactionDtos = transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            FromAccountId = t.FromAccountId,
            ToAccountId = t.ToAccountId,
            TransactionType = t.TransactionType,
            Amount = t.Amount,
            Currency = t.Currency,
            Status = t.Status,
            Description = t.Description,
            ReferenceNumber = t.ReferenceNumber,
            Fee = t.Fee,
            CreatedAt = t.CreatedAt,
            ProcessedAt = t.ProcessedAt
        }).ToList();

        return Ok(transactionDtos);
    }
}


