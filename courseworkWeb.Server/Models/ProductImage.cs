using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class ProductImage
    {
        [Key]
        public required int Id { get; set; }
        
        [ForeignKey("Product")]
        public required int ProductId { get; set; }
        public required string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }

        [JsonIgnore]
        public Product? Product { get; set; }
    }
}
