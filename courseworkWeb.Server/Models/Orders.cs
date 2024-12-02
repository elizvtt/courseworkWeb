using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCoursework.Server.Models
{
    public class Orders
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Client")]
        public required int ClientId { get; set; }
        public required string Address{ get; set; }
        
        [ForeignKey("DeliveryMethod")]
        public required int DeliveryMethodId { get; set; }
        public required string PaymentMethod { get; set; }
        public required DateTime OrderDate{ get; set; }
        public decimal TotalAmount { get; set; }
        public required string Status { get; set; } = "В обробці";

        public required Client Client { get; set; }
        public required DeliveryMethod DeliveryMethod { get; set; }
        public required ICollection<OrderItem> OrderItems { get; set; }

    }
}
