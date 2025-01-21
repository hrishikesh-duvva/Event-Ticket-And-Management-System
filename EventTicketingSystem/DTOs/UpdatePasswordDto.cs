namespace EventTicketingSystem.DTOs
{
    public class UpdatePasswordDto
    {
        public required string PhoneNumber { get; set; }
        public required string NewPassword { get; set; }
    }
}
