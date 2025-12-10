using AuthService.Application.Commands;
using AuthService.Application.DTOs;
using AuthService.Domain.Entities;
using AuthService.Domain.Repositories;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Kernel.Common;
using Shared.Messaging;
using Shared.Security;
using System.Collections.Generic;
using Xunit;

namespace AuthService.Application.Tests.Commands;

public class RegisterCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<KafkaProducer> _kafkaProducerMock;
    private readonly Mock<ILogger<RegisterCommandHandler>> _loggerMock;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtTokenService _tokenService;
    private readonly RegisterCommandHandler _handler;

    public RegisterCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _kafkaProducerMock = new Mock<KafkaProducer>(Mock.Of<IConfiguration>(), Mock.Of<ILogger<KafkaProducer>>());
        _loggerMock = new Mock<ILogger<RegisterCommandHandler>>();
        
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "JwtSettings:SecretKey", "YourSuperSecretKeyForJWTTokenGeneration123456789" },
                { "JwtSettings:Issuer", "BankingPlatform" },
                { "JwtSettings:Audience", "BankingPlatform" }
            })
            .Build();
        
        _passwordHasher = new PasswordHasher();
        _tokenService = new JwtTokenService(configuration);
        
        _handler = new RegisterCommandHandler(
            _userRepositoryMock.Object,
            _passwordHasher,
            _kafkaProducerMock.Object,
            _tokenService,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task Handle_WhenEmailExists_ReturnsFailure()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "1234567890"
        };

        _userRepositoryMock.Setup(x => x.EmailExistsAsync(request.Email))
            .ReturnsAsync(true);

        var command = new RegisterCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.ErrorMessage.Should().Be("Email already registered");
    }

    [Fact]
    public async Task Handle_WhenEmailDoesNotExist_CreatesUserAndReturnsSuccess()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "1234567890"
        };

        _userRepositoryMock.Setup(x => x.EmailExistsAsync(request.Email))
            .ReturnsAsync(false);

        User? createdUser = null;
        _userRepositoryMock.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User user) =>
            {
                createdUser = user;
                return user;
            });

        _kafkaProducerMock.Setup(x => x.PublishAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var command = new RegisterCommand { Request = request };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.User.Email.Should().Be(request.Email);
        result.Data.Token.Should().NotBeEmpty();
        
        _userRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Once);
        _kafkaProducerMock.Verify(x => x.PublishAsync("user-registered", It.IsAny<object>(), It.IsAny<string>()), Times.Once);
    }
}

