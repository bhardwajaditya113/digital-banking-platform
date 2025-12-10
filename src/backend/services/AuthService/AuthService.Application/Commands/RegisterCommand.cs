using AuthService.Application.DTOs;
using AuthService.Domain.Entities;
using AuthService.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Shared.Kernel.Common;
using Shared.Messaging;
using Shared.Security;

namespace AuthService.Application.Commands;

public class RegisterCommand
{
    public RegisterRequest Request { get; set; } = new();
}

public class RegisterCommandHandler
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHasher _passwordHasher;
    private readonly KafkaProducer _kafkaProducer;
    private readonly JwtTokenService _tokenService;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        IUserRepository userRepository,
        PasswordHasher passwordHasher,
        KafkaProducer kafkaProducer,
        JwtTokenService tokenService,
        ILogger<RegisterCommandHandler> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _kafkaProducer = kafkaProducer;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<AuthResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        // Validate email doesn't exist
        if (await _userRepository.EmailExistsAsync(request.Email))
        {
            return Result<AuthResponse>.Failure("Email already registered");
        }

        // Create user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        // Assign default role
        user.UserRoles.Add(new UserRole
        {
            RoleName = "Customer",
            CreatedAt = DateTime.UtcNow
        });

        var createdUser = await _userRepository.CreateAsync(user);

        // Publish user registered event
        await _kafkaProducer.PublishAsync("user-registered", new
        {
            UserId = createdUser.Id,
            Email = createdUser.Email,
            FirstName = createdUser.FirstName,
            LastName = createdUser.LastName,
            RegisteredAt = createdUser.CreatedAt
        });

        _logger.LogInformation($"User registered: {createdUser.Email}");

        // Generate token
        var roles = createdUser.UserRoles.Select(r => r.RoleName).ToList();
        var token = _tokenService.GenerateToken(createdUser.Id.ToString(), createdUser.Email, roles);

        var response = new AuthResponse
        {
            Token = token,
            RefreshToken = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new UserDto
            {
                Id = createdUser.Id,
                Email = createdUser.Email,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                Roles = roles
            }
        };

        return Result<AuthResponse>.Success(response);
    }
}

