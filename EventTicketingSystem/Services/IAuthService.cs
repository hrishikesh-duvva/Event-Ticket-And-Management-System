using EventTicketingSystem.Models;

namespace EventTicketingSystem.Services
{
    public interface IAuthService
    {
        string GenerateToken(User user);
    }
}
