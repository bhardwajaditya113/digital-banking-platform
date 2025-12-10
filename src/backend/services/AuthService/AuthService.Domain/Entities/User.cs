using Shared.Kernel.Entities;

namespace AuthService.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsEmailVerified { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public List<UserRole> UserRoles { get; set; } = new();
}

public class UserRole : BaseEntity
{
    public Guid UserId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public User? User { get; set; }
}


