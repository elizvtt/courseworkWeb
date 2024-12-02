using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCoursework.Server.Models
{
    public class OrderItem
    {
        [Key]
        public required int Id { get; set; }
        
        [ForeignKey("Orders")]
        public int OrderId { get; set; }
        
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        
        public int Quantity { get; set; } // Кількість товару
        public decimal PriceAtPurchase { get; set; } // Ціна на момент покупки

        public required Orders Order { get; set; } // Зв'язок із замовленням
        public required Product Product { get; set; } // Зв'язок з товаром
    }
}
