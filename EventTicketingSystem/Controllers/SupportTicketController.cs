using EventTicketingSystem.Data;
using EventTicketingSystem.Helpers;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventTicketingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportTicketController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SupportTicketController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CreateSupportTicket([FromBody] SupportTicket ticket)
        {
            if (ticket == null || string.IsNullOrWhiteSpace(ticket.Issue))
                return BadRequest("Issue description is required.");

            // Get UserId from JWT token
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user.");

            
            ticket.UserId = userId;
            ticket.User = null; 
            ticket.Status = "Pending";
            ticket.CreatedAt = DateTime.UtcNow;

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Support ticket submitted successfully." });
        }




        // Get all issues (Support Agent only)
        [HttpGet]
        [Authorize(Roles = RoleConstants.SupportAgent)]
        public async Task<IActionResult> GetAllIssues()
        {
            var issues = await _context.SupportTickets
                .Include(t => t.User)
                .Select(t => new
                {
                    t.Id,
                    t.Issue,
                    t.Status,
                    t.CreatedAt,
                    User = new
                    {
                        t.User.UserId,
                        t.User.Username,
                        t.User.Email,
                        t.User.PhoneNumber
                    }
                })
                .ToListAsync();

            return Ok(issues);
        }


        // Update issue status (Support Agent only)
        [HttpPut("{id}")]
        [Authorize(Roles = RoleConstants.SupportAgent)]
        public async Task<IActionResult> ResolveIssue(int id)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);

            if (ticket == null)
                return NotFound("Issue not found.");

            ticket.Status = "Resolved";
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Issue resolved successfully!" });
        }
    }
}
