using CatalogOfCoursesAndTeachers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CatalogOfCoursesAndTeachers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Login) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.UserName))
            {
                return BadRequest("Заполните все поля");
            }

            var exists = await _context.Users.AnyAsync(u => u.Login == request.Login);

            if (exists)
                return BadRequest("Пользователь с таким логином уже существует");

            var user = new AppUser
            {
                Login = request.Login,
                Password = request.Password,
                UserName = request.UserName
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                UserName = user.UserName
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Login == request.Login && u.Password == request.Password);

            if (user == null)
                return Unauthorized("Неверный логин или пароль");

            var token = GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                UserName = user.UserName
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userName = User.Identity?.Name ?? "Пользователь";

            return Ok(new UserInfo
            {
                UserName = userName
            });
        }

        private string GenerateToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Login)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}