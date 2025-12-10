using AccountService.Application.DTOs;
using AccountService.Domain.Entities;
using AccountService.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Shared.Kernel.Common;
using Shared.Messaging;

namespace AccountService.Application.Commands;

public class CreateAccountCommand
{
    public CreateAccountRequest Request { get; set; } = new();
}

public class CreateAccountCommandHandler
{
    private readonly IAccountRepository _accountRepository;
    private readonly KafkaProducer _kafkaProducer;
    private readonly ILogger<CreateAccountCommandHandler> _logger;

    public CreateAccountCommandHandler(
        IAccountRepository accountRepository,
        KafkaProducer kafkaProducer,
        ILogger<CreateAccountCommandHandler> logger)
    {
        _accountRepository = accountRepository;
        _kafkaProducer = kafkaProducer;
        _logger = logger;
    }

    public async Task<Result<AccountDto>> Handle(CreateAccountCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        // Generate unique account number
        var accountNumber = GenerateAccountNumber();

        var account = new Account
        {
            UserId = request.UserId,
            AccountNumber = accountNumber,
            AccountType = request.AccountType,
            Currency = request.Currency,
            Balance = 0,
            AvailableBalance = 0,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        // Create default wallet for the account currency
        account.Wallets.Add(new Wallet
        {
            Currency = request.Currency,
            Balance = 0,
            CreatedAt = DateTime.UtcNow
        });

        var createdAccount = await _accountRepository.CreateAsync(account);

        // Publish account created event
        await _kafkaProducer.PublishAsync("account-created", new
        {
            AccountId = createdAccount.Id,
            UserId = createdAccount.UserId,
            AccountNumber = createdAccount.AccountNumber,
            AccountType = createdAccount.AccountType,
            Currency = createdAccount.Currency,
            CreatedAt = createdAccount.CreatedAt
        });

        _logger.LogInformation($"Account created: {createdAccount.AccountNumber} for user {createdAccount.UserId}");

        var accountDto = new AccountDto
        {
            Id = createdAccount.Id,
            UserId = createdAccount.UserId,
            AccountNumber = createdAccount.AccountNumber,
            AccountType = createdAccount.AccountType,
            Currency = createdAccount.Currency,
            Balance = createdAccount.Balance,
            AvailableBalance = createdAccount.AvailableBalance,
            IsActive = createdAccount.IsActive,
            Wallets = createdAccount.Wallets.Select(w => new WalletDto
            {
                Id = w.Id,
                Currency = w.Currency,
                Balance = w.Balance
            }).ToList()
        };

        return Result<AccountDto>.Success(accountDto);
    }

    private string GenerateAccountNumber()
    {
        // Generate 12-digit account number
        var random = new Random();
        var accountNumber = string.Empty;
        for (int i = 0; i < 12; i++)
        {
            accountNumber += random.Next(0, 10).ToString();
        }
        return accountNumber;
    }
}

