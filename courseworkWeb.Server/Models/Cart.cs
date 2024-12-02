using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCoursework.Server.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Client")]
        public required int ClientId { get; set; }

        public required Client Client { get; set; }
        public required ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    }
}
