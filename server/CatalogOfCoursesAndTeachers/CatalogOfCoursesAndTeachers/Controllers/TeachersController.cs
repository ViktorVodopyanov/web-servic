using CatalogOfCoursesAndTeachers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CatalogOfCoursesAndTeachers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teachers = await _context.Teachers
                .Include(t => t.Courses)
                .ToListAsync();

            return Ok(teachers);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string department)
        {
            if (string.IsNullOrWhiteSpace(department))
                return BadRequest("Department is required");

            var result = await _context.Teachers
                .Include(t => t.Courses)
                .Where(t => t.Department.Contains(department))
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Teacher teacher)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = teacher.Id }, teacher);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Teacher updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
                return NotFound();

            teacher.Name = updated.Name;
            teacher.Department = updated.Department;

            await _context.SaveChangesAsync();

            return Ok(teacher);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.Courses)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null)
                return NotFound();

            if (teacher.Courses != null && teacher.Courses.Any())
                return BadRequest("Cannot delete teacher because he has courses");

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}