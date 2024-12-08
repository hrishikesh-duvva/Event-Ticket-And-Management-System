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



//public int Capacity { get; set; }
//public required string Status { get; set; }
//public int VIPRows { get; set; }
//public int GeneralRows { get; set; }
//public decimal VIPPrice { get; set; }
//public decimal GeneralPrice { get; set; }
