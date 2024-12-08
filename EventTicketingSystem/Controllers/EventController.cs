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
            var eventDto = new GetEventDto
            {
                EventId = eventDetails.EventId,
                Name = eventDetails.Name,
                Location = eventDetails.Location,
                Description = eventDetails.Description,
                EventImage = eventDetails.EventImage,
                Schedules = eventDetails.Schedules.Select(schedule => new GetScheduleDto
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
            // Ensure the user is authorized by checking the token's userId
            var currentUserId = int.Parse(User.FindFirstValue("UserId"));
            if (userId != currentUserId)
            {
                return Unauthorized("You are not authorized to access these events.");
            }

            // Get the events for the user
            var events = await _context.Events
                .Where(e => e.OrganizerId == userId)
                .Include(e => e.Schedules)  // Include schedules for each event
                .ThenInclude(s => s.TicketTypes) // Include ticket types for each schedule if needed
                .ToListAsync();

            if (events == null || events.Count == 0)
            {
                return NotFound("No events found for this user.");
            }

            // Map the events to GetEventDto (not EventDto)
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
                    // No seating details here
                }).ToList()
            }).ToList();

            return Ok(eventDtos);
        }






        // Update Event
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventDto eventDto)
        {
            // Check if the user has the EventOrganizer role
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

            // Check if the user is authorized to modify this event
            if (eventToUpdate.OrganizerId != userId)
            {
                return Unauthorized("You are not authorized to update this event.");
            }

            // Update fields only if they are provided in the request
            if (eventDto.Name != null) eventToUpdate.Name = eventDto.Name;
            if (eventDto.Location != null) eventToUpdate.Location = eventDto.Location;
            if (eventDto.Description != null) eventToUpdate.Description = eventDto.Description;
            if (eventDto.EventImage != null) eventToUpdate.EventImage = eventDto.EventImage;

            // Mark the entity as modified
            _context.Entry(eventToUpdate).State = EntityState.Modified;

            // Save the changes
            await _context.SaveChangesAsync();

            // Return a NoContent response to indicate the update was successful but no content is returned
            return NoContent();
        }


        // Delete Event
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var userRole = User.FindFirstValue("UserRole");
            if (userRole != "EventOrganizer")
            {
                return Unauthorized("Only Event Organizers can delete events.");
            }

            var userId = int.Parse(User.FindFirstValue("UserId"));
            var eventToDelete = await _context.Events
                .Include(e => e.Schedules)  // Include schedules to handle them first
                .FirstOrDefaultAsync(e => e.EventId == id);

            if (eventToDelete == null)
            {
                return NotFound();
            }

            // Check if the user is authorized to delete this event
            if (eventToDelete.OrganizerId != userId)
            {
                return Unauthorized("You are not authorized to delete this event.");
            }

            // Step 1: Delete associated Discounts
            foreach (var schedule in eventToDelete.Schedules)
            {
                var discounts = await _context.Discounts
                    .Where(d => d.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();

                _context.Discounts.RemoveRange(discounts);
            }

            // Step 2: Delete associated TicketTypes and Seatings
            foreach (var schedule in eventToDelete.Schedules)
            {
                // Remove TicketTypes related to the schedule
                var ticketTypes = await _context.TicketTypes
                    .Where(t => t.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();
                _context.TicketTypes.RemoveRange(ticketTypes);

                // Remove Seatings related to the schedule
                var seatings = await _context.Seatings
                    .Where(s => s.ScheduleId == schedule.ScheduleId)
                    .ToListAsync();
                _context.Seatings.RemoveRange(seatings);
            }

            // Step 3: Delete Schedules
            _context.Schedules.RemoveRange(eventToDelete.Schedules);

            // Step 4: Finally delete the Event
            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }




    }

}
