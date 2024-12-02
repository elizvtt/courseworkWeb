using System.ComponentModel.DataAnnotations;

namespace WebCoursework.Server.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }
        public required string FullName { get; set; }
        public required DateTime DateBirth { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; } = "user";
        public int BonusPoints { get; set; } = 0;
    }
}
