using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace IntegrationTests;

public class AuthServiceIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthServiceIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var registerRequest = new
        {
            email = $"test{Guid.NewGuid()}@example.com",
            password = "Password123!",
            firstName = "Test",
            lastName = "User",
            phoneNumber = "1234567890"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>();
        content.Should().NotBeNull();
        content!.Token.Should().NotBeEmpty();
        content.User.Should().NotBeNull();
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
    {
        // Arrange
        var email = $"test{Guid.NewGuid()}@example.com";
        var registerRequest = new
        {
            email = email,
            password = "Password123!",
            firstName = "Test",
            lastName = "User",
            phoneNumber = "1234567890"
        };

        // Register first time
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act - Try to register again with same email
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var email = $"test{Guid.NewGuid()}@example.com";
        var password = "Password123!";
        
        // Register user
        var registerRequest = new
        {
            email = email,
            password = password,
            firstName = "Test",
            lastName = "User",
            phoneNumber = "1234567890"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act
        var loginRequest = new { email = email, password = password };
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>();
        content.Should().NotBeNull();
        content!.Token.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new
        {
            email = "nonexistent@example.com",
            password = "WrongPassword123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}

// Helper classes for deserialization
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; } = new();
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}


