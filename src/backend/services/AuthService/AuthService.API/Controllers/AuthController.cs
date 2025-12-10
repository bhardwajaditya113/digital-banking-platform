using AuthService.Application.Commands;
using AuthService.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Shared.Kernel.Common;

namespace AuthService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RegisterCommandHandler _registerHandler;
    private readonly LoginCommandHandler _loginHandler;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        RegisterCommandHandler registerHandler,
        LoginCommandHandler loginHandler,
        ILogger<AuthController> logger)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user account
    /// </summary>
    /// <param name="request">User registration details</param>
    /// <returns>Authentication token and user information</returns>
    /// <response code="200">Registration successful</response>
    /// <response code="400">Invalid request or email already exists</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand { Request = request };
        var result = await _registerHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.ErrorMessage, errors = result.Errors });
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Authenticate user and generate JWT token
    /// </summary>
    /// <param name="request">User login credentials</param>
    /// <returns>Authentication token and user information</returns>
    /// <response code="200">Login successful</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand { Request = request };
        var result = await _loginHandler.Handle(command, CancellationToken.None);

        if (!result.IsSuccess)
        {
            return Unauthorized(new { error = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPost("validate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult ValidateToken()
    {
        // Token validation is handled by middleware
        return Ok(new { valid = true });
    }
}

