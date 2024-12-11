using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class ProductAttribute
    {
        [Key]
        public required int Id { get; set; }
        
        [ForeignKey("Product")]
        public required int ProductId { get; set; }
        
        [ForeignKey("Attributes")]
        public required int AttributeId { get; set; }
        public required string Value { get; set; }

        [JsonIgnore]
        public Product? Product { get; set; }
        public required Attributes Attribute { get; set; }

    }
}
