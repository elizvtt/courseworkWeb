using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Orders")]
        public int OrderId { get; set; }
        
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        
        public int Quantity { get; set; }
        public decimal PriceAtPurchase { get; set; }

        [JsonIgnore]
        public Orders? Order { get; set; }

        // [JsonIgnore]
        // public Product? Product { get; set; }
        public required Product Product { get; set; }
    }
}
