using AccountService.Domain.Entities;
using AccountService.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Shared.Messaging;

namespace AccountService.Application.EventHandlers;

public class TransactionEventHandler
{
    private readonly IAccountRepository _accountRepository;
    private readonly ILogger<TransactionEventHandler> _logger;

    public TransactionEventHandler(
        IAccountRepository accountRepository,
        ILogger<TransactionEventHandler> logger)
    {
        _accountRepository = accountRepository;
        _logger = logger;
    }

    public async Task HandleTransactionInitiated(dynamic transactionEvent)
    {
        try
        {
            var fromAccountId = Guid.Parse(transactionEvent.FromAccountId.ToString());
            var toAccountId = transactionEvent.ToAccountId != null 
                ? Guid.Parse(transactionEvent.ToAccountId.ToString()) 
                : (Guid?)null;
            var amount = decimal.Parse(transactionEvent.Amount.ToString());
            var fee = decimal.Parse(transactionEvent.Fee?.ToString() ?? "0");
            var totalAmount = decimal.Parse(transactionEvent.TotalAmount.ToString());

            // Update from account balance
            var fromAccount = await _accountRepository.GetByIdAsync(fromAccountId);
            if (fromAccount != null)
            {
                if (fromAccount.AvailableBalance >= totalAmount)
                {
                    fromAccount.Balance -= totalAmount;
                    fromAccount.AvailableBalance -= totalAmount;
                    await _accountRepository.UpdateAsync(fromAccount);
                    _logger.LogInformation($"Updated from account {fromAccount.AccountNumber}: -${totalAmount}");
                }
                else
                {
                    _logger.LogWarning($"Insufficient balance in account {fromAccount.AccountNumber}");
                }
            }

            // Update to account balance if internal transfer
            if (toAccountId.HasValue)
            {
                var toAccount = await _accountRepository.GetByIdAsync(toAccountId.Value);
                if (toAccount != null)
                {
                    toAccount.Balance += amount;
                    toAccount.AvailableBalance += amount;
                    await _accountRepository.UpdateAsync(toAccount);
                    _logger.LogInformation($"Updated to account {toAccount.AccountNumber}: +${amount}");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing transaction event");
        }
    }
}


