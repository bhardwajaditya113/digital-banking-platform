using Microsoft.Extensions.Logging;
using Shared.Kernel.Common;
using Shared.Messaging;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Entities;
using TransactionService.Domain.Repositories;

namespace TransactionService.Application.Commands;

public class TransferCommand
{
    public TransferRequest Request { get; set; } = new();
}

public class TransferCommandHandler
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly KafkaProducer _kafkaProducer;
    private readonly ILogger<TransferCommandHandler> _logger;
    private const decimal TransactionFeePercentage = 0.01m; // 1% fee
    private const decimal MinTransactionFee = 0.50m;

    public TransferCommandHandler(
        ITransactionRepository transactionRepository,
        KafkaProducer kafkaProducer,
        ILogger<TransferCommandHandler> logger)
    {
        _transactionRepository = transactionRepository;
        _kafkaProducer = kafkaProducer;
        _logger = logger;
    }

    public async Task<Result<TransactionDto>> Handle(TransferCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        // Validate amount
        if (request.Amount <= 0)
        {
            return Result<TransactionDto>.Failure("Amount must be greater than zero");
        }

        // Calculate fee
        var fee = Math.Max(request.Amount * TransactionFeePercentage, MinTransactionFee);
        var totalAmount = request.Amount + fee;

        // Create transaction record
        var transaction = new Transaction
        {
            FromAccountId = request.FromAccountId,
            ToAccountId = request.ToAccountId,
            TransactionType = "Transfer",
            Amount = request.Amount,
            Currency = request.Currency,
            Status = "Pending",
            Description = request.Description,
            ReferenceNumber = GenerateReferenceNumber(),
            Fee = fee,
            CreatedAt = DateTime.UtcNow
        };

        var createdTransaction = await _transactionRepository.CreateAsync(transaction);

        // Publish transaction initiated event (Account Service will handle balance updates)
        await _kafkaProducer.PublishAsync("transaction-initiated", new
        {
            TransactionId = createdTransaction.Id,
            FromAccountId = request.FromAccountId,
            ToAccountId = request.ToAccountId,
            Amount = request.Amount,
            Fee = fee,
            TotalAmount = totalAmount,
            Currency = request.Currency,
            ReferenceNumber = createdTransaction.ReferenceNumber,
            CreatedAt = createdTransaction.CreatedAt
        });

        _logger.LogInformation($"Transfer initiated: {createdTransaction.ReferenceNumber}");

        var transactionDto = new TransactionDto
        {
            Id = createdTransaction.Id,
            FromAccountId = createdTransaction.FromAccountId,
            ToAccountId = createdTransaction.ToAccountId,
            TransactionType = createdTransaction.TransactionType,
            Amount = createdTransaction.Amount,
            Currency = createdTransaction.Currency,
            Status = createdTransaction.Status,
            Description = createdTransaction.Description,
            ReferenceNumber = createdTransaction.ReferenceNumber,
            Fee = createdTransaction.Fee,
            CreatedAt = createdTransaction.CreatedAt
        };

        return Result<TransactionDto>.Success(transactionDto);
    }

    private string GenerateReferenceNumber()
    {
        return $"TXN{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}

