using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CatalogOfCoursesAndTeachers.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public int Duration { get; set; }

        public int TeacherId { get; set; }

        [JsonIgnore]
        public Teacher? Teacher { get; set; }

        [JsonIgnore]
        public List<Student>? Students { get; set; }
    }
}