using EventTicketingSystem.Models;
using EventTicketingSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventTicketingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketBookingController : ControllerBase
    {
        private readonly TicketBookingService _ticketBookingService;

        public TicketBookingController(TicketBookingService ticketBookingService)
        {
            _ticketBookingService = ticketBookingService;
        }

        [HttpPost("book-ticket")]
        public async Task<IActionResult> BookTicket([FromBody] TicketBookingRequest request)
        {
            var result = await _ticketBookingService.BookTickets(
                request.CustomerId,
                request.ScheduleId,
                request.SeatIds,
                request.TicketTypeId,
                request.Quantity,
                request.PaymentMethod
            );

            if (result.success)
            {
                return Ok(new { message = result.message });
            }
            else
            {
                return BadRequest(new { message = result.message });
            }
        }
    }
}
