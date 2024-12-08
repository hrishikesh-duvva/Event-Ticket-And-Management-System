namespace EventTicketingSystem.Models
{
    public class TicketBookingRequest
    {
        public int CustomerId { get; set; }       // ID of the customer making the booking
        public int ScheduleId { get; set; }       // ID of the schedule being booked
        public int[] SeatIds { get; set; }        // Array of Seat IDs being booked
        public int TicketTypeId { get; set; }     // ID of the TicketType (VIP/General)
        public int Quantity { get; set; }         // Number of tickets to book
        public string PaymentMethod { get; set; } // Payment method to use (e.g., CreditCard)
    }
}
