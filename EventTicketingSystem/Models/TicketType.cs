
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EventTicketingSystem.Models
{
    public class TicketType
    {
        public int TicketTypeId { get; set; }
        public int EventId { get; set; }
        [JsonIgnore] // Prevent circular reference
        public Event Event { get; set; }
        public TicketTypeEnum TicketTypee { get; set; }
        public decimal Price { get; set; }
        public int SeatAvailability { get; set; }

        [ForeignKey("Schedule")]
        public int ScheduleId { get; set; }
        public Schedule Schedule { get; set; }
    }

    public enum TicketTypeEnum:int
    {
        VIP,
        General
    }

}
