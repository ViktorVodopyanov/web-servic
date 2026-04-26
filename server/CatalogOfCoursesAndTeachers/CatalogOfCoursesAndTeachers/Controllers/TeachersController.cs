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
            var teachers = await _context.Teachers.ToListAsync();
            return Ok(teachers);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string department)
        {
            if (string.IsNullOrWhiteSpace(department))
                return BadRequest("Department is required");

            var result = await _context.Teachers
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

            return Ok(teacher);
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
            var hasCourses = await _context.Courses.AnyAsync(c => c.TeacherId == id);

            if (hasCourses)
                return BadRequest("Cannot delete teacher because teacher has courses");

            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
                return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}