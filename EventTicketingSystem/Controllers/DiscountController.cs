using EventTicketingSystem.Data;
using EventTicketingSystem.DTOs;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/discounts")]
[ApiController]
public class DiscountController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DiscountController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Create Discount
    [HttpPost]
    public async Task<ActionResult<Discount>> CreateDiscount([FromBody] DiscountDto discountDto)
    {
        var discountStatus = Enum.TryParse(discountDto.Status, true, out DiscountStatus status);

        if (!discountStatus)
        {
            return BadRequest("Invalid discount status.");
        }

        var eventExists = await _context.Events.AnyAsync(e => e.EventId == discountDto.EventId);
        var ticketTypeExists = await _context.TicketTypes.AnyAsync(t => t.TicketTypeId == discountDto.TicketTypeId);
        var scheduleExists = await _context.Schedules.AnyAsync(s => s.ScheduleId == discountDto.ScheduleId);

        if (!eventExists || !ticketTypeExists || !scheduleExists)
        {
            return BadRequest("Invalid Event, TicketType, or Schedule.");
        }

        var discount = new Discount
        {
            EventId = discountDto.EventId,
            TicketTypeId = discountDto.TicketTypeId,  // Set TicketTypeId
            ScheduleId = discountDto.ScheduleId,      // Set ScheduleId
            DiscountCode = discountDto.DiscountCode,
            DiscountPercentage = discountDto.DiscountPercentage,
            StartDate = discountDto.StartDate,
            EndDate = discountDto.EndDate,
            Status = status
        };

        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetDiscount", new { id = discount.DiscountId }, discount);
    }

    // Get Discount
    [HttpGet("{id}")]
    public async Task<ActionResult<Discount>> GetDiscount(int id)
    {
        var discount = await _context.Discounts
            .Include(d => d.Event)
            .FirstOrDefaultAsync(d => d.DiscountId == id);

        if (discount == null)
        {
            return NotFound();
        }

        return Ok(discount);
    }


    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<IEnumerable<Discount>>> GetDiscountsForEvent(int eventId)
    {
        var discounts = await _context.Discounts
            .Where(d => d.EventId == eventId && d.StartDate <= DateTime.Now && d.EndDate >= DateTime.Now)
            .ToListAsync();

        if (!discounts.Any())
        {
            return NotFound("No discounts available for this event.");
        }

        return Ok(discounts);
    }


    // Update Discount
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDiscount(int id, [FromBody] DiscountDto discountDto)
    {
        var discountToUpdate = await _context.Discounts.FindAsync(id);

        if (discountToUpdate == null)
        {
            return NotFound();
        }
        var discountStatus = Enum.TryParse(discountDto.Status, true, out DiscountStatus status);

        if (!discountStatus)
        {
            return BadRequest("Invalid discount status.");
        }


        discountToUpdate.DiscountCode = discountDto.DiscountCode;
        discountToUpdate.DiscountPercentage = discountDto.DiscountPercentage;
        discountToUpdate.StartDate = discountDto.StartDate;
        discountToUpdate.EndDate = discountDto.EndDate;
        discountToUpdate.Status = status;

        _context.Entry(discountToUpdate).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Delete Discount
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscount(int id)
    {
        var discountToDelete = await _context.Discounts
            .Include(d => d.Schedule)  // Ensure Schedule is loaded for cascading deletions
            .FirstOrDefaultAsync(d => d.DiscountId == id);

        if (discountToDelete == null)
        {
            return NotFound();
        }

        // Step 1: Remove Discount
        _context.Discounts.Remove(discountToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
