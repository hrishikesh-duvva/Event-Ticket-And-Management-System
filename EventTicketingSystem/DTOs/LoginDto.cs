using System.Reflection.Metadata;

namespace EventTicketingSystem.DTOs
{
    public class LoginDto
    {
        public required string PhoneNumber { get; set; }
        public required string Role { get; set; }
        public required string Password { get; set; }
    }
}
