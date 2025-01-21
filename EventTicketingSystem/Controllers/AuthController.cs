using EventTicketingSystem.Data;
using EventTicketingSystem.DTOs;
using EventTicketingSystem.Helpers;
using EventTicketingSystem.Models;
using EventTicketingSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventTicketingSystem.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        public AuthController(IAuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            if (_context.Users.Any(u => u.Username == registerDto.Username))
                return BadRequest(new { message = "Username already exists" });

            if (!RoleConstants.AllRoles.Contains(registerDto.Role))
                return BadRequest(new { message = "Invalid role specified." });

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Username = registerDto.Username,
                PasswordHash = hashedPassword,
                Role = registerDto.Role,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                IsActive = true
            };
            
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = _context.Users.FirstOrDefault(u =>
        u.Role.ToLower() == loginDto.Role.ToLower() &&
        u.PhoneNumber == loginDto.PhoneNumber);

            if (user == null)
                return Unauthorized(new { message = "Invalid Credentials" });

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid Credentials" });
            var token = _authService.GenerateToken(user);
            return Ok(new { token });
        }

        // New API: Check if phone number exists
        [HttpPost("checkPhoneNumber")]
        public IActionResult CheckPhoneNumber([FromBody] CheckPhoneNumberDto checkPhoneNumberDto)
        {
            var exists = _context.Users.Any(u => u.PhoneNumber == checkPhoneNumberDto.PhoneNumber);
            return Ok(new { exists });
        }

        // New API: Update password
        [HttpPost("updatePassword")]
        public IActionResult UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == updatePasswordDto.PhoneNumber);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatePasswordDto.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Password updated successfully" });
        }
    }
}
