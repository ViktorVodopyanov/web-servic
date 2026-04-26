using CatalogOfCoursesAndTeachers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CatalogOfCoursesAndTeachers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _context.Courses.ToListAsync();
            return Ok(courses);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Title is required");

            var result = await _context.Courses
                .Where(c => c.Title.Contains(title))
                .ToListAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Course course)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == course.TeacherId);

            if (!teacherExists)
                return BadRequest("Teacher not found");

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return Ok(course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Course updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                return NotFound();

            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == updated.TeacherId);

            if (!teacherExists)
                return BadRequest("Teacher not found");

            course.Title = updated.Title;
            course.Duration = updated.Duration;
            course.TeacherId = updated.TeacherId;

            await _context.SaveChangesAsync();

            return Ok(course);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var hasStudents = await _context.Students.AnyAsync(s => s.CourseId == id);

            if (hasStudents)
                return BadRequest("Cannot delete course because course has students");

            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}