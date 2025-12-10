using AuthService.Application.DTOs;
using AuthService.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Shared.Kernel.Common;
using Shared.Security;

namespace AuthService.Application.Commands;

public class LoginCommand
{
    public LoginRequest Request { get; set; } = new();
}

public class LoginCommandHandler
{
    private readonly IUserRepository _userRepository;
    private readonly JwtTokenService _tokenService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IUserRepository userRepository,
        JwtTokenService tokenService,
        ILogger<LoginCommandHandler> logger)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<AuthResponse>> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return Result<AuthResponse>.Failure("Invalid email or password");
        }

        if (!user.IsActive)
        {
            return Result<AuthResponse>.Failure("Account is deactivated");
        }

        if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Result<AuthResponse>.Failure("Invalid email or password");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var roles = user.UserRoles.Select(r => r.RoleName).ToList();
        var token = _tokenService.GenerateToken(user.Id.ToString(), user.Email, roles);

        var response = new AuthResponse
        {
            Token = token,
            RefreshToken = Guid.NewGuid().ToString(),
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles
            }
        };

        _logger.LogInformation($"User logged in: {user.Email}");

        return Result<AuthResponse>.Success(response);
    }
}

