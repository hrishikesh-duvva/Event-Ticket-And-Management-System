using System.ComponentModel.DataAnnotations.Schema;

namespace EventTicketingSystem.Models
{
    public class Seating
    {
        public int SeatingId { get; set; }

       

        public string SeatNumber { get; set; }
        public string Row { get; set; }
        public string Section { get; set; }
        public SeatStatus AvailabilityStatus { get; set; }

        [ForeignKey("TicketType")]
        public int TicketTypeId { get; set; }
        public TicketType TicketType { get; set; }

        [ForeignKey("Schedule")]
        public int ScheduleId { get; set; } // Schedule-based seating
        public Schedule Schedule { get; set; }

        [ForeignKey("TicketBooking")]
        public int? BookingId { get; set; }
        public TicketBooking TicketBooking { get; set; }


    }


    public enum SeatStatus:int
    {
        Available,
        Booked,
        Reserved
    }

}
//[ForeignKey("Event")]
//public int EventId { get; set; }
//public Event Event { get; set; }