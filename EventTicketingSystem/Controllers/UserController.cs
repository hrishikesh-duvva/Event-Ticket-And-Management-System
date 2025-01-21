// UserController.cs
using EventTicketingSystem.Data;
using EventTicketingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EventTicketingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        [Authorize] 
        public async Task<IActionResult> GetUserDetails(int userId)
        {
            var user = await _context.Users
                                      .Where(u => u.UserId == userId)
                                      .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }
    }
}
