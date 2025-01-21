using EventTicketingSystem.Data;
using EventTicketingSystem.DTOs;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventTicketingSystem.Controllers
{
    [Route("api/schedules")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Schedule
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Schedule>> CreateSchedule([FromBody] ScheduleDto scheduleDto)
        {
            var eventExists = await _context.Events.AnyAsync(e => e.EventId == scheduleDto.EventId);
            if (!eventExists)
            {
                return BadRequest("Event does not exist.");
            }
            if (!Enum.TryParse<EventStatus>(scheduleDto.Status, out var status))
            {
                return BadRequest("Invalid event status.");
            }
            var schedule = new Schedule
            {
                EventId = scheduleDto.EventId,
                SessionName = scheduleDto.SessionName,
                StartTime = scheduleDto.StartTime,
                EndTime = scheduleDto.EndTime,
                SpeakerName = scheduleDto.SpeakerName,
                Description = scheduleDto.Description,
                Status = status,
                Capacity = scheduleDto.Capacity,  // Set Capacity here
                VIPRows = scheduleDto.VIPRows,
                GeneralRows = scheduleDto.GeneralRows
            };

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            // Create TicketTypes (VIP & General)
            var vipTicket = new TicketType
            {
                EventId = scheduleDto.EventId,
                TicketTypee = TicketTypeEnum.VIP,
                Price = scheduleDto.VIPPrice,
                SeatAvailability = scheduleDto.VIPRows * scheduleDto.Capacity,
                ScheduleId= schedule.ScheduleId
            };
            _context.TicketTypes.Add(vipTicket);

            var generalTicket = new TicketType
            {
                EventId = scheduleDto.EventId,
                TicketTypee = TicketTypeEnum.General,
                Price = scheduleDto.GeneralPrice,
                SeatAvailability = scheduleDto.GeneralRows * scheduleDto.Capacity, 
                ScheduleId = schedule.ScheduleId
            };
            _context.TicketTypes.Add(generalTicket);

            await _context.SaveChangesAsync();

            // Create Discounts if provided
            if (scheduleDto.Discounts != null)
            {
                foreach (var discountDto in scheduleDto.Discounts)
                {
                    var discount = new Discount
                    {
                        EventId = discountDto.EventId,
                        TicketTypeId = discountDto.TicketTypeId,
                        ScheduleId = schedule.ScheduleId,
                        DiscountCode = discountDto.DiscountCode,
                        DiscountPercentage = discountDto.DiscountPercentage,
                        StartDate = discountDto.StartDate,
                        EndDate = discountDto.EndDate,
                        Status = Enum.TryParse(discountDto.Status, true, out DiscountStatus discountStatus) ? discountStatus : DiscountStatus.Expired
                    };
                    _context.Discounts.Add(discount);
                }

                await _context.SaveChangesAsync();
            }


            await CreateSeatingForSchedule(schedule.EventId, schedule.ScheduleId, scheduleDto);

            return CreatedAtAction("GetSchedule", new { id = schedule.ScheduleId }, schedule);
        }

        private async Task CreateSeatingForSchedule(int eventId, int scheduleId, ScheduleDto scheduleDto)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Event) 
                .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId && s.EventId == eventId);

            if (schedule == null)
            {
                throw new Exception("Schedule or Event not found.");
            }

            //  creating seating
            var vipTicketType = await _context.TicketTypes
                .FirstOrDefaultAsync(tt => tt.EventId == eventId && tt.TicketTypee == TicketTypeEnum.VIP && tt.ScheduleId == scheduleId);

            var generalTicketType = await _context.TicketTypes
                .FirstOrDefaultAsync(tt => tt.EventId == eventId && tt.TicketTypee == TicketTypeEnum.General && tt.ScheduleId == scheduleId);

            if (vipTicketType == null || generalTicketType == null)
            {
                return; 
            }

            // Create VIP Seats
            for (int i = 1; i <= scheduleDto.VIPRows; i++)
            {
                for (int j = 1; j <= 10; j++) 
                {
                    var seat = new Seating
                    {
                        SeatNumber = $"{i}-{j}",
                        Row = $"VIP-{i}",
                        Section = "VIP",
                        AvailabilityStatus = SeatStatus.Available,
                        TicketTypeId = vipTicketType.TicketTypeId, 
                        ScheduleId = scheduleId 
                    };
                    _context.Seatings.Add(seat);
                }
            }

            for (int i = scheduleDto.VIPRows + 1; i <= scheduleDto.VIPRows + scheduleDto.GeneralRows; i++)
            {
                for (int j = 1; j <= 20; j++) 
                {
                    var seat = new Seating
                    {
                        SeatNumber = $"{i}-{j}",
                        Row = $"General-{i}",
                        Section = "General",
                        AvailabilityStatus = SeatStatus.Available,
                        TicketTypeId = generalTicketType.TicketTypeId, 
                        ScheduleId = scheduleId 
                    };
                    _context.Seatings.Add(seat);
                }
            }

            await _context.SaveChangesAsync();
        }


        // Get Schedule
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var currentTime = DateTime.UtcNow; 
            var schedule = await _context.Schedules
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.ScheduleId == id && s.EndTime > currentTime);

            if (schedule == null)
            {
                return NotFound("Schedule not found or has already ended.");
            }
            if (schedule.EndTime < currentTime)
            {
                return BadRequest($"Schedule with ID {id} has expired.");
            }
            return Ok(schedule);
        }


        // Update Schedule
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleDto scheduleDto)
        {
            var scheduleToUpdate = await _context.Schedules
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.ScheduleId == id);

            if (scheduleToUpdate == null)
            {
                return NotFound();
            }

            if (!Enum.TryParse<EventStatus>(scheduleDto.Status, out var status))
            {
                return BadRequest("Invalid event status.");
            }

            // Update Schedule Details
            scheduleToUpdate.SessionName = scheduleDto.SessionName;
            scheduleToUpdate.StartTime = scheduleDto.StartTime;
            scheduleToUpdate.EndTime = scheduleDto.EndTime;
            scheduleToUpdate.SpeakerName = scheduleDto.SpeakerName;
            scheduleToUpdate.Description = scheduleDto.Description;
            scheduleToUpdate.Status = status;
            scheduleToUpdate.Capacity = scheduleDto.Capacity; // Update capacity
            scheduleToUpdate.VIPRows = scheduleDto.VIPRows;
            scheduleToUpdate.GeneralRows = scheduleDto.GeneralRows;

            // Update Ticket Prices
            var vipTicket = await _context.TicketTypes
                .FirstOrDefaultAsync(tt => tt.ScheduleId == id && tt.TicketTypee == TicketTypeEnum.VIP);
            if (vipTicket != null)
            {
                vipTicket.Price = scheduleDto.VIPPrice;
                vipTicket.SeatAvailability = scheduleDto.VIPRows * scheduleDto.Capacity;
                _context.Entry(vipTicket).State = EntityState.Modified;
            }

            var generalTicket = await _context.TicketTypes
                .FirstOrDefaultAsync(tt => tt.ScheduleId == id && tt.TicketTypee == TicketTypeEnum.General);
            if (generalTicket != null)
            {
                generalTicket.Price = scheduleDto.GeneralPrice;
                generalTicket.SeatAvailability = scheduleDto.GeneralRows * scheduleDto.Capacity;
                _context.Entry(generalTicket).State = EntityState.Modified;
            }

            // Save Changes
            _context.Entry(scheduleToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("schedule/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var userRole = User.FindFirstValue("UserRole");
            if (userRole != "EventOrganizer")
            {
                return Unauthorized("Only Event Organizers can delete schedules.");
            }

            var userId = int.Parse(User.FindFirstValue("UserId"));
            var scheduleToDelete = await _context.Schedules
                .Include(s => s.Event) 
                .FirstOrDefaultAsync(s => s.ScheduleId == id);

            if (scheduleToDelete == null)
            {
                return NotFound();
            }

            if (scheduleToDelete.Event.OrganizerId != userId)
            {
                return Unauthorized("You are not authorized to delete this schedule.");
            }

            // Step 1: delete Discounts
            var discounts = await _context.Discounts
                .Where(d => d.ScheduleId == scheduleToDelete.ScheduleId)
                .ToListAsync();
            _context.Discounts.RemoveRange(discounts);

            // Step 2: delete  TicketTypes
            var ticketTypes = await _context.TicketTypes
                .Where(t => t.ScheduleId == scheduleToDelete.ScheduleId)
                .ToListAsync();
            _context.TicketTypes.RemoveRange(ticketTypes);

            // Step 3: delete Seatings
            var seatings = await _context.Seatings
                .Where(s => s.ScheduleId == scheduleToDelete.ScheduleId)
                .ToListAsync();
            _context.Seatings.RemoveRange(seatings);

            // Step 4: delete the Schedule
            _context.Schedules.Remove(scheduleToDelete);

            await _context.SaveChangesAsync();

            return NoContent();
        }




    }

}
