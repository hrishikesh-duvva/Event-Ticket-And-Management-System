namespace EventTicketingSystem.DTOs
{
    public class ScheduleDto
    {
        public int EventId { get; set; }
        public required string SessionName { get; set; }
        public  DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required string SpeakerName { get; set; }
        public required string Description { get; set; }
        public int VIPRows { get; set; }  // Add VIP row count
        public int GeneralRows { get; set; }  // Add General row count
        public required string Status { get; set; }
        public int Capacity { get; set; }  // The schedule-specific capacity
        public decimal VIPPrice { get; set; }
        public decimal GeneralPrice { get; set; }
    }
}
