using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CatalogOfCoursesAndTeachers.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        public int CourseId { get; set; }

        [JsonIgnore]
        public Course? Course { get; set; }
    }
}