using EventTicketingSystem.Data;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventTicketingSystem.Controllers
{
    [Route("api/tickettypes")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get TicketTypes for an Event
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesForEvent(int eventId)
        {
            var ticketTypes = await _context.TicketTypes
                .Where(t => t.EventId == eventId)
                .ToListAsync();

            if (!ticketTypes.Any())
            {
                return NotFound();
            }

            return Ok(ticketTypes);
        }

        // Delete TicketType
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketType(int id)
        {
            var ticketTypeToDelete = await _context.TicketTypes
                .Include(t => t.Schedule)
                .FirstOrDefaultAsync(t => t.TicketTypeId == id);

            if (ticketTypeToDelete == null)
            {
                return NotFound();
            }

            // Step 1: Remove TicketType
            _context.TicketTypes.Remove(ticketTypeToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}
