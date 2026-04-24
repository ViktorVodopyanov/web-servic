using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CatalogOfCoursesAndTeachers.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Course>? Courses { get; set; }
    }
}