using AccountService.Application.EventHandlers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.Messaging;

namespace AccountService.Infrastructure.Consumers;

public class TransactionConsumer : KafkaConsumer<TransactionEvent>
{
    private readonly TransactionEventHandler _eventHandler;

    public TransactionConsumer(
        IConfiguration configuration,
        ILogger<TransactionConsumer> logger,
        TransactionEventHandler eventHandler)
        : base(configuration, logger, "transaction-initiated", "account-service-group")
    {
        _eventHandler = eventHandler;
    }

    protected override async Task ProcessMessageAsync(TransactionEvent message, CancellationToken cancellationToken)
    {
        await _eventHandler.HandleTransactionInitiated(message);
    }
}

public class TransactionEvent
{
    public string TransactionId { get; set; } = string.Empty;
    public string FromAccountId { get; set; } = string.Empty;
    public string? ToAccountId { get; set; }
    public decimal Amount { get; set; }
    public decimal Fee { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string ReferenceNumber { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}


