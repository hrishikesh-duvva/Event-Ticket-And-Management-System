
namespace EventTicketingSystem.Models
{
    public enum EventStatus:int
    {
        Upcoming,
        Ongoing,
        Completed,
        Canceled
    }
    public class Event
    {
        public int EventId { get; set; }
        public required string Name { get; set; }
        public required string Location { get; set; }
        public required string Description { get; set; }
        public int OrganizerId { get; set; }
        public string EventImage { get; set; }

        public ICollection<Schedule> Schedules { get; set; }


    }


}



//public User Organizer { get; set; }
//public int Capacity { get; set; }
//public EventStatus Status { get; set; }
//public int VIPRows { get; set; }
//public int GeneralRows { get; set; }

//public ICollection<TicketType> TicketTypes { get; set; }
//[JsonIgnore] // Prevent circular reference
//public ICollection<Seating> Seating { get; set; }