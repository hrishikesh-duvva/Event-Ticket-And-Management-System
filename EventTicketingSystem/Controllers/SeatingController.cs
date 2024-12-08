using EventTicketingSystem.Data;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventTicketingSystem.Controllers
{
    [Route("api/seating")]
    [ApiController]
    public class SeatingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeatingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get Seating for a specific Event and Schedule
        [HttpGet("event/{eventId}/schedule/{scheduleId}")]
        public async Task<ActionResult<IEnumerable<Seating>>> GetSeatingForEventAndSchedule(int eventId, int scheduleId)
        {
            // Ensure the schedule exists for the given eventId and scheduleId
            var schedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.EventId == eventId && s.ScheduleId == scheduleId);

            if (schedule == null)
            {
                return NotFound("Schedule not found for the given EventId and ScheduleId.");
            }

            // Fetch the seating for the specific schedule
            var seating = await _context.Seatings
                .Where(s => s.ScheduleId == scheduleId)
                .ToListAsync();

            if (!seating.Any())
            {
                return NotFound("No seating found for the given ScheduleId.");
            }

            return Ok(seating); // Return the seating data if found
        }

    }

}
