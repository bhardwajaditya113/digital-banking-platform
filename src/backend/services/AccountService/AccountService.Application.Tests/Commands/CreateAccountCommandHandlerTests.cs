using AccountService.Application.Commands;
using AccountService.Application.DTOs;
using AccountService.Domain.Entities;
using AccountService.Domain.Repositories;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Kernel.Common;
using Shared.Messaging;
using Xunit;

namespace AccountService.Application.Tests.Commands;

public class CreateAccountCommandHandlerTests
{
    private readonly Mock<IAccountRepository> _accountRepositoryMock;
    private readonly Mock<KafkaProducer> _kafkaProducerMock;
    private readonly Mock<ILogger<CreateAccountCommandHandler>> _loggerMock;
    private readonly CreateAccountCommandHandler _handler;

    public CreateAccountCommandHandlerTests()
    {
        _accountRepositoryMock = new Mock<IAccountRepository>();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "KafkaSettings:BootstrapServers", "localhost:9092" }
            })
            .Build();
        _kafkaProducerMock = new Mock<KafkaProducer>(configuration, Mock.Of<ILogger<KafkaProducer>>());
        _loggerMock = new Mock<ILogger<CreateAccountCommandHandler>>();

        _handler = new CreateAccountCommandHandler(
            _accountRepositoryMock.Object,
            _kafkaProducerMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task Handle_WhenValidRequest_CreatesAccountAndReturnsSuccess()
    {
        // Arrange
        var request = new CreateAccountRequest
        {
            UserId = Guid.NewGuid(),
            AccountType = "Savings",
            Currency = "USD"
        };

        Account? createdAccount = null;
        _accountRepositoryMock.Setup(x => x.CreateAsync(It.IsAny<Account>()))
            .ReturnsAsync((Account account) =>
            {
                createdAccount = account;
                return account;
            });

        _kafkaProducerMock.Setup(x => x.PublishAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var command = new CreateAccountCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.AccountNumber.Should().NotBeEmpty();
        result.Data.AccountType.Should().Be(request.AccountType);
        result.Data.Currency.Should().Be(request.Currency);
        result.Data.Wallets.Should().HaveCount(1);
        result.Data.Wallets.First().Currency.Should().Be(request.Currency);

        _accountRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<Account>()), Times.Once);
        _kafkaProducerMock.Verify(x => x.PublishAsync("account-created", It.IsAny<object>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenValidRequest_GeneratesUniqueAccountNumber()
    {
        // Arrange
        var request = new CreateAccountRequest
        {
            UserId = Guid.NewGuid(),
            AccountType = "Checking",
            Currency = "EUR"
        };

        _accountRepositoryMock.Setup(x => x.CreateAsync(It.IsAny<Account>()))
            .ReturnsAsync((Account account) => account);

        _kafkaProducerMock.Setup(x => x.PublishAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var command = new CreateAccountCommand { Request = request };

        // Act
        var result1 = await _handler.Handle(command, CancellationToken.None);
        var result2 = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result1.Data!.AccountNumber.Should().NotBe(result2.Data!.AccountNumber);
    }
}


