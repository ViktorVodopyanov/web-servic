namespace CatalogOfCoursesAndTeachers.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public int CourseId { get; set; }
        public Course? Course { get; set; }
    }
}