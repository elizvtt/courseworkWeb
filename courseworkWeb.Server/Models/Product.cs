using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class Product
    {
        [Key]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required decimal Price { get; set; }
        public required int Quantity { get; set; } // Кількість товару на складі
        
        [ForeignKey("Category")]
        public required int CategoryId { get; set; }
        public required string Brand { get; set; }
        public required int Guarantee { get; set; }
        public decimal? DiscountPrice { get; set; }

        public required Category Category { get; set; }


        public IList<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        [JsonIgnore]
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();


        public required IList<ProductAttribute> ProductAttributes { get; set; }
        public required IList<Review> Reviews{ get; set; }
    }
}
