using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public required Product Product { get; set; }
    }
}
