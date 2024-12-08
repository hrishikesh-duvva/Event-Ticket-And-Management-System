using EventTicketingSystem.Models;

namespace EventTicketingSystem.DTOs
{
    public class GetEventDto
    {
        public int EventId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string EventImage { get; set; }
        public int OrganizerId { get; set; }
        public ICollection<GetScheduleDto> Schedules { get; set; }
    }

    public class GetScheduleDto
    {
        public int ScheduleId { get; set; }
        public string SessionName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string SpeakerName { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public EventStatus Status { get; set; }
        public ICollection<GetSeatingDto> Seating { get; set; }
    }

    public class GetSeatingDto
    {
        public int SeatingId { get; set; }
        public string SeatNumber { get; set; }
        public string Row { get; set; }
        public string Section { get; set; }
        public SeatStatus AvailabilityStatus { get; set; }
        public int TicketTypeId { get; set; }
    }
}

