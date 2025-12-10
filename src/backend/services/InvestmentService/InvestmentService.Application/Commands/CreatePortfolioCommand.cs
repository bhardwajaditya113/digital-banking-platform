using InvestmentService.Application.DTOs;
using InvestmentService.Domain.Entities;
using InvestmentService.Domain.Repositories;
using Shared.Kernel.Common;
using Shared.Messaging;

namespace InvestmentService.Application.Commands;

public class CreatePortfolioCommand
{
    public CreatePortfolioRequest Request { get; set; } = new();
}

public class CreatePortfolioCommandHandler
{
    private readonly IPortfolioRepository _portfolioRepository;
    private readonly KafkaProducer _kafkaProducer;
    private readonly ILogger<CreatePortfolioCommandHandler> _logger;

    public CreatePortfolioCommandHandler(
        IPortfolioRepository portfolioRepository,
        KafkaProducer kafkaProducer,
        ILogger<CreatePortfolioCommandHandler> logger)
    {
        _portfolioRepository = portfolioRepository;
        _kafkaProducer = kafkaProducer;
        _logger = logger;
    }

    public async Task<Result<PortfolioDto>> Handle(CreatePortfolioCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var portfolio = new Portfolio
        {
            UserId = request.UserId,
            Name = request.Name,
            TotalValue = 0,
            TotalInvested = 0,
            TotalReturn = 0,
            ReturnPercentage = 0,
            CreatedAt = DateTime.UtcNow
        };

        var createdPortfolio = await _portfolioRepository.CreateAsync(portfolio);

        await _kafkaProducer.PublishAsync("portfolio-created", new
        {
            PortfolioId = createdPortfolio.Id,
            UserId = createdPortfolio.UserId,
            Name = createdPortfolio.Name,
            CreatedAt = createdPortfolio.CreatedAt
        });

        _logger.LogInformation($"Portfolio created: {createdPortfolio.Name} for user {createdPortfolio.UserId}");

        var portfolioDto = new PortfolioDto
        {
            Id = createdPortfolio.Id,
            UserId = createdPortfolio.UserId,
            Name = createdPortfolio.Name,
            TotalValue = createdPortfolio.TotalValue,
            TotalInvested = createdPortfolio.TotalInvested,
            TotalReturn = createdPortfolio.TotalReturn,
            ReturnPercentage = createdPortfolio.ReturnPercentage,
            Investments = createdPortfolio.Investments.Select(i => new InvestmentDto
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

        return Result<PortfolioDto>.Success(portfolioDto);
    }
}


