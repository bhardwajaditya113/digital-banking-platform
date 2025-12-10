using InvestmentService.Application.Commands;
using InvestmentService.Application.DTOs;
using InvestmentService.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Kernel.Common;
using System.Security.Claims;

namespace InvestmentService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioRepository _portfolioRepository;
    private readonly CreatePortfolioCommandHandler _createPortfolioHandler;
    private readonly ILogger<PortfolioController> _logger;

    public PortfolioController(
        IPortfolioRepository portfolioRepository,
        CreatePortfolioCommandHandler createPortfolioHandler,
        ILogger<PortfolioController> logger)
    {
        _portfolioRepository = portfolioRepository;
        _createPortfolioHandler = createPortfolioHandler;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(PortfolioDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePortfolio([FromBody] CreatePortfolioRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || !Guid.TryParse(userId, out var userIdGuid))
        {
            return Unauthorized();
        }

        request.UserId = userIdGuid;
        var command = new CreatePortfolioCommand { Request = request };
        var result = await _createPortfolioHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetPortfolio), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PortfolioDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPortfolio(Guid id)
    {
        var portfolio = await _portfolioRepository.GetByIdAsync(id);
        if (portfolio == null)
        {
            return NotFound();
        }

        var portfolioDto = new PortfolioDto
        {
            Id = portfolio.Id,
            UserId = portfolio.UserId,
            Name = portfolio.Name,
            TotalValue = portfolio.TotalValue,
            TotalInvested = portfolio.TotalInvested,
            TotalReturn = portfolio.TotalReturn,
            ReturnPercentage = portfolio.ReturnPercentage,
            Investments = portfolio.Investments.Select(i => new InvestmentDto
            {
                Id = i.Id,
                Symbol = i.Symbol,
                InvestmentType = i.InvestmentType,
                Quantity = i.Quantity,
                PurchasePrice = i.PurchasePrice,
                CurrentPrice = i.CurrentPrice,
                TotalValue = i.TotalValue,
                PurchaseDate = i.PurchaseDate
            }).ToList()
        };

        return Ok(portfolioDto);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(List<PortfolioDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserPortfolios(Guid userId)
    {
        var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
        var portfolioDtos = portfolios.Select(p => new PortfolioDto
        {
            Id = p.Id,
            UserId = p.UserId,
            Name = p.Name,
            TotalValue = p.TotalValue,
            TotalInvested = p.TotalInvested,
            TotalReturn = p.TotalReturn,
            ReturnPercentage = p.ReturnPercentage,
            Investments = p.Investments.Select(i => new InvestmentDto
            {
                Id = i.Id,
                Symbol = i.Symbol,
                InvestmentType = i.InvestmentType,
                Quantity = i.Quantity,
                PurchasePrice = i.PurchasePrice,
                CurrentPrice = i.CurrentPrice,
                TotalValue = i.TotalValue,
                PurchaseDate = i.PurchaseDate
            }).ToList()
        }).ToList();

        return Ok(portfolioDtos);
    }
}


