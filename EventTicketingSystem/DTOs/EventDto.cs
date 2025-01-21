namespace EventTicketingSystem.DTOs
{
    public class EventDto
    {
        public  string? Name { get; set; }
        public  string? Location { get; set; }
        public  string? Description { get; set; }
        public int OrganizerId { get; set; }
        public string? EventImage { get; set; }
        public ICollection<GetScheduleDto> Schedules { get; set; }

    }
}



