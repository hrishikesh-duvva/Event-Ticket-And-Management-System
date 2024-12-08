using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventTicketingSystem.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [ForeignKey("TicketBooking")]
        public int BookingId { get; set; }
        public TicketBooking TicketBooking { get; set; }

        [Required]
        public decimal PaymentAmount { get; set; }

        [Required]
        public string PaymentMethod { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
        public string TransactionId { get; set; }
    }

    public enum PaymentStatus
    {
        Pending,
        Success,
        Failed
    }
}
