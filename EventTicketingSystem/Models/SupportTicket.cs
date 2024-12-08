namespace EventTicketingSystem.Models
{
    public class SupportTicket
    {
        public int Id { get; set; } // Primary Key
        public int UserId { get; set; } // User who raised the issue
        public string Issue { get; set; } // Issue details
        public string Status { get; set; } = "Pending"; // Issue status (Pending/Resolved)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Time of issue creation

        // Navigation property to link the ticket to a user
        public User User { get; set; }
    }
}
