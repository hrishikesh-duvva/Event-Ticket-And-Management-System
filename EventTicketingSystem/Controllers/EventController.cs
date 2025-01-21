using EventTicketingSystem.Data;
using EventTicketingSystem.DTOs;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace EventTicketingSystem.Controllers
{
    [Route("api/events")]
    [ApiController]
    
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create Event
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] EventDto eventDto)
        {
            var userRole = User.FindFirstValue("UserRole");
            if (userRole != "EventOrganizer")
            {
                return Unauthorized("Only Event Organizers can create events.");
            }

            // Extract UserId from JWT token
            var userId = int.Parse(User.FindFirstValue("UserId"));
            

            var newEvent = new Event
            {
                Name = eventDto.Name,
                Location = eventDto.Location,
                Description = eventDto.Description,
                OrganizerId = userId, //from jwt token
                EventImage=eventDto.EventImage
                
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            

           
            return CreatedAtAction("GetEvent", new { id = newEvent.EventId }, newEvent);
        }



        // Get All Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents()
        {
            var events = await _context.Events
                .Select(e => new
                {
                    e.EventId,
                    e.Name,
                    e.Location,
                    e.OrganizerId,
                    e.EventImage
                })
                .ToListAsync();

            return Ok(events);
        }

        // Get Event
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var currentTime = DateTime.UtcNow;

            var eventDetails = await _context.Events
                .Include(e => e.Schedules)
                .ThenInclude(s => s.TicketTypes)
                .Include(e => e.Schedules)
                .ThenInclude(s => s.Seating)
                .FirstOrDefaultAsync(e => e.EventId == id);

            if (eventDetails == null)
            {
                return NotFound();
            }
            var filteredSchedules = eventDetails.Schedules
               .Where(schedule => schedule.EndTime > currentTime)
               .ToList();
            var eventDto = new GetEventDto
            {
                EventId = eventDetails.EventId,
                Name = eventDetails.Name,
                Location = eventDetails.Location,
                Description = eventDetails.Description,
                EventImage = eventDetails.EventImage,
                Schedules = filteredSchedules.Select(schedule => new GetScheduleDto
                {
                    ScheduleId = schedule.ScheduleId,
                    SessionName = schedule.SessionName,
                    StartTime = schedule.StartTime,
                    EndTime = schedule.EndTime,
                    SpeakerName = schedule.SpeakerName,
                    Description = schedule.Description,
                    Capacity = schedule.Capacity,
                    Status = schedule.Status,
                    Seating = schedule.Seating.Select(seat => new GetSeatingDto
                    {
                        SeatingId = seat.SeatingId,
                        SeatNumber = seat.SeatNumber,
                        Row = seat.Row,
                        Section = seat.Section,
                        AvailabilityStatus = seat.AvailabilityStatus,
                        TicketTypeId = seat.TicketTypeId
                    }).ToList()
                }).ToList()
            };

            return Ok(eventDetails);
        }


        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<GetEventDto>>> GetEventsByUserId(int userId)
        {
            var currentUserId = int.Parse(User.FindFirstValue("UserId"));
            if (userId != currentUserId)
            {
                return Unauthorized("You are not authorized to access these events.");
            }

            // Get the events for the user
            var events = await _context.Events
                .Where(e => e.OrganizerId == userId)
                .Include(e => e.Schedules)  
                .ThenInclude(s => s.TicketTypes) 
                .ToListAsync();

            if (events == null || events.Count == 0)
            {
                return NotFound("No events found for this user.");
            }

            var eventDtos = events.Select(e => new GetEventDto
            {
                EventId = e.EventId, // Add EventId if needed
                Name = e.Name,
                Location = e.Location,
                Description = e.Description,
                OrganizerId = e.OrganizerId,
                EventImage = e.EventImage,
                Schedules = e.Schedules.Select(schedule => new GetScheduleDto
                {
                    ScheduleId = schedule.ScheduleId,
                    SessionName = schedule.SessionName,
                    StartTime = schedule.StartTime,
                    EndTime = schedule.EndTime,
                    SpeakerName = schedule.SpeakerName,
                    Description = schedule.Description,
                    Capacity = schedule.Capacity,
                    Status = schedule.Status
                }).ToList()
            }).ToList();

            return Ok(eventDtos);
        }






        // Update Event
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventDto eventDto)
        {
            var userRole = User.FindFirstValue("UserRole");
            if (userRole != "EventOrganizer")
            {
                return Unauthorized("Only Event Organizers can update events.");
            }

            var userId = int.Parse(User.FindFirstValue("UserId"));
            var eventToUpdate = await _context.Events.FindAsync(id);

            if (eventToUpdate == null)
            {
                return NotFound();
            }

            if (eventToUpdate.OrganizerId != userId)
            {
                return Unauthorized("You are not authorized to update this event.");
            }

            if (eventDto.Name != null) eventToUpdate.Name = eventDto.Name;
            if (eventDto.Location != null) eventToUpdate.Location = eventDto.Location;
            if (eventDto.Description != null) eventToUpdate.Description = eventDto.Description;
            if (eventDto.EventImage != null) eventToUpdate.EventImage = eventDto.EventImage;

            _context.Entry(eventToUpdate).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // Delete Event
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var userRole = User.FindFirstValue("UserRole");
            if (userRole != "Admin")
            {
                return Unauthorized("Only Admin can delete events.");
            }

            var userId = int.Parse(User.FindFirstValue("UserId"));
            var eventToDelete = await _context.Events
                .Include(e => e.Schedules)  
                .FirstOrDefaultAsync(e => e.EventId == id);

            if (eventToDelete == null)
            {
                return NotFound();
            }

            

            // Step 1: delete Discounts
            foreach (var schedule in eventToDelete.Schedules)
            {
                var discounts = await _context.Discounts
                    .Where(d => d.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();

                _context.Discounts.RemoveRange(discounts);
            }

            // Step 2: delete TicketTypes and Seatings
            foreach (var schedule in eventToDelete.Schedules)
            {
                // remove TicketTypes related to the schedule
                var ticketTypes = await _context.TicketTypes
                    .Where(t => t.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();
                _context.TicketTypes.RemoveRange(ticketTypes);

                // remove Seatings related to the schedule
                var seatings = await _context.Seatings
                    .Where(s => s.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();
                _context.Seatings.RemoveRange(seatings);
            }

            // Step 3: delete Schedules
            _context.Schedules.RemoveRange(eventToDelete.Schedules);

            // Step 4:delete the Event
            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }




    }

}
