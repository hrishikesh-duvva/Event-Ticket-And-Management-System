using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventTicketingSystem.Models
{
    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled
    }
    public class TicketBooking
    {
        [Key]
        public int BookingId { get; set; }

        [ForeignKey("User")]
        public int CustomerId { get; set; }
        public User User { get; set; }

        [ForeignKey("Schedule")]
        public int ScheduleId { get; set; }
        public Schedule Schedule { get; set; }

        [ForeignKey("TicketType")]
        public int TicketTypeId { get; set; }
        public TicketType TicketType { get; set; }

        [Required]
        public int Quantity { get; set; }

        public decimal TotalPrice { get; set; }
        public DateTime BookingDate { get; set; }
        public BookingStatus Status { get; set; }

        public ICollection<Seating> BookedSeats { get; set; }
    }

    
}
