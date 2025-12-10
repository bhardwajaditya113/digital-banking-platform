using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Kernel.Common;
using Shared.Messaging;
using TransactionService.Application.Commands;
using TransactionService.Application.DTOs;
using TransactionService.Domain.Repositories;
using Xunit;

namespace TransactionService.Application.Tests.Commands;

public class TransferCommandHandlerTests
{
    private readonly Mock<ITransactionRepository> _transactionRepositoryMock;
    private readonly Mock<KafkaProducer> _kafkaProducerMock;
    private readonly Mock<ILogger<TransferCommandHandler>> _loggerMock;
    private readonly TransferCommandHandler _handler;

    public TransferCommandHandlerTests()
    {
        _transactionRepositoryMock = new Mock<ITransactionRepository>();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "KafkaSettings:BootstrapServers", "localhost:9092" }
            })
            .Build();
        _kafkaProducerMock = new Mock<KafkaProducer>(configuration, Mock.Of<ILogger<KafkaProducer>>());
        _loggerMock = new Mock<ILogger<TransferCommandHandler>>();

        _handler = new TransferCommandHandler(
            _transactionRepositoryMock.Object,
            _kafkaProducerMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task Handle_WhenAmountIsZero_ReturnsFailure()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = Guid.NewGuid(),
            ToAccountId = Guid.NewGuid(),
            Amount = 0,
            Currency = "USD"
        };

        var command = new TransferCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.ErrorMessage.Should().Be("Amount must be greater than zero");
    }

    [Fact]
    public async Task Handle_WhenAmountIsNegative_ReturnsFailure()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = Guid.NewGuid(),
            ToAccountId = Guid.NewGuid(),
            Amount = -100,
            Currency = "USD"
        };

        var command = new TransferCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.ErrorMessage.Should().Be("Amount must be greater than zero");
    }

    [Fact]
    public async Task Handle_WhenValidRequest_CreatesTransactionAndReturnsSuccess()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = Guid.NewGuid(),
            ToAccountId = Guid.NewGuid(),
            Amount = 100,
            Currency = "USD",
            Description = "Test transfer"
        };

        TransactionService.Domain.Entities.Transaction? createdTransaction = null;
        _transactionRepositoryMock.Setup(x => x.CreateAsync(It.IsAny<TransactionService.Domain.Entities.Transaction>()))
            .ReturnsAsync((TransactionService.Domain.Entities.Transaction transaction) =>
            {
                createdTransaction = transaction;
                return transaction;
            });

        _kafkaProducerMock.Setup(x => x.PublishAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var command = new TransferCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Amount.Should().Be(request.Amount);
        result.Data.Currency.Should().Be(request.Currency);
        result.Data.Status.Should().Be("Pending");
        result.Data.ReferenceNumber.Should().NotBeEmpty();
        result.Data.Fee.Should().BeGreaterThan(0);

        _transactionRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<TransactionService.Domain.Entities.Transaction>()), Times.Once);
        _kafkaProducerMock.Verify(x => x.PublishAsync("transaction-initiated", It.IsAny<object>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenValidRequest_CalculatesFeeCorrectly()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = Guid.NewGuid(),
            ToAccountId = Guid.NewGuid(),
            Amount = 100,
            Currency = "USD"
        };

        _transactionRepositoryMock.Setup(x => x.CreateAsync(It.IsAny<TransactionService.Domain.Entities.Transaction>()))
            .ReturnsAsync((TransactionService.Domain.Entities.Transaction transaction) => transaction);

        _kafkaProducerMock.Setup(x => x.PublishAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var command = new TransferCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Data!.Fee.Should().BeGreaterOrEqualTo(0.50m); // Minimum fee
    }
}


