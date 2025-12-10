using AccountService.Application.Commands;
using AccountService.Application.DTOs;
using AccountService.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Caching;
using Shared.Kernel.Common;
using System.Security.Claims;

namespace AccountService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IAccountRepository _accountRepository;
    private readonly CreateAccountCommandHandler _createAccountHandler;
    private readonly ICacheService _cacheService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        IAccountRepository accountRepository,
        CreateAccountCommandHandler createAccountHandler,
        ICacheService cacheService,
        ILogger<AccountController> logger)
    {
        _accountRepository = accountRepository;
        _createAccountHandler = createAccountHandler;
        _cacheService = cacheService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(AccountDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            return Unauthorized();
        }

        request.UserId = userIdGuid;
        var command = new CreateAccountCommand { Request = request };
        var result = await _createAccountHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetAccount), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AccountDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAccount(Guid id)
    {
        // Try cache first
        var cacheKey = $"account:{id}";
        var cachedAccount = await _cacheService.GetAsync<AccountDto>(cacheKey);
        if (cachedAccount != null)
        {
            return Ok(cachedAccount);
        }

        var account = await _accountRepository.GetByIdAsync(id);
        if (account == null)
        {
            return NotFound();
        }

        var accountDto = new AccountDto
        {
            Id = account.Id,
            UserId = account.UserId,
            AccountNumber = account.AccountNumber,
            AccountType = account.AccountType,
            Currency = account.Currency,
            Balance = account.Balance,
            AvailableBalance = account.AvailableBalance,
            IsActive = account.IsActive,
            Wallets = account.Wallets.Select(w => new WalletDto
            {
                Id = w.Id,
                Currency = w.Currency,
                Balance = w.Balance
            }).ToList()
        };

        // Cache the result
        await _cacheService.SetAsync(cacheKey, accountDto, TimeSpan.FromMinutes(5));

        return Ok(accountDto);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(List<AccountDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserAccounts(Guid userId)
    {
        var accounts = await _accountRepository.GetByUserIdAsync(userId);
        var accountDtos = accounts.Select(a => new AccountDto
        {
            Id = a.Id,
            UserId = a.UserId,
            AccountNumber = a.AccountNumber,
            AccountType = a.AccountType,
            Currency = a.Currency,
            Balance = a.Balance,
            AvailableBalance = a.AvailableBalance,
            IsActive = a.IsActive,
            Wallets = a.Wallets.Select(w => new WalletDto
            {
                Id = w.Id,
                Currency = w.Currency,
                Balance = w.Balance
            }).ToList()
        }).ToList();

        return Ok(accountDtos);
    }
}

