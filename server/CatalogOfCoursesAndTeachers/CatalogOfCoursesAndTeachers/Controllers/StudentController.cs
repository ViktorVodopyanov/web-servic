using CatalogOfCoursesAndTeachers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CatalogOfCoursesAndTeachers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(int courseId)
        {
            var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);

            if (!courseExists)
                return NotFound("Course not found");

            var students = await _context.Students
                .Where(s => s.CourseId == courseId)
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Name is required");

            var students = await _context.Students
                .Where(s => s.FullName.Contains(name))
                .ToListAsync();

            return Ok(students);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var courseExists = await _context.Courses.AnyAsync(c => c.Id == student.CourseId);

            if (!courseExists)
                return BadRequest("Course not found");

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Student updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound();

            var courseExists = await _context.Courses.AnyAsync(c => c.Id == updated.CourseId);

            if (!courseExists)
                return BadRequest("Course not found");

            student.FullName = updated.FullName;
            student.CourseId = updated.CourseId;

            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}