using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }

        [ForeignKey("Parent")]
        public int? ParentId { get; set; }

        public Category? Parent { get; set; }

        [JsonIgnore]
        public IList<Category> Subcategories { get; set; } = new List<Category>();

        [JsonIgnore]
        public IList<Attributes> Attributes { get; set; } = new List<Attributes>();
    }
}