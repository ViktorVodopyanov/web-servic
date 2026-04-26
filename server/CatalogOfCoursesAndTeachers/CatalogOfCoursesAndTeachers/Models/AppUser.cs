using System.ComponentModel.DataAnnotations;

namespace CatalogOfCoursesAndTeachers.Models
{
    public class AppUser
    {
        public int Id { get; set; }

        [Required]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;
    }
}