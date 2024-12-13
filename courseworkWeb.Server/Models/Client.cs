using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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

        [JsonIgnore]
        public IList<Cart> Carts { get; set; } = new List<Cart>();
        
        public IList<Orders> Orders { get; set; } = new List<Orders>();

    }
}
