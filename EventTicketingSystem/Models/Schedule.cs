using System.Text.Json.Serialization;

namespace EventTicketingSystem.Models
{
    public class Schedule
    {
        public int ScheduleId { get; set; }
        public int EventId { get; set; }
        public Event Event { get; set; }
        public string SessionName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string SpeakerName { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public EventStatus Status { get; set; }
        public int VIPRows { get; set; }
        public int GeneralRows { get; set; }
        public ICollection<TicketType> TicketTypes { get; set; }

        [JsonIgnore] // Prevent circular reference
        public ICollection<Seating> Seating { get; set; }
    }

}
