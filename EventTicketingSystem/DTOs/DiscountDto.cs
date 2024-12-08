namespace EventTicketingSystem.DTOs
{
    public class DiscountDto
    {
        public int EventId { get; set; }
        public int TicketTypeId { get; set; }  
        public int ScheduleId { get; set; }
        public required string DiscountCode { get; set; }
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Status { get; set; } // Active or Expired
    }
}
