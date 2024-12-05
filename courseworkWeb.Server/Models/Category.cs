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

        // Властивість для доступу до батьківської категорії
        public Category? Parent { get; set; }

        // Властивість для доступу до дочірніх категорій
        [JsonIgnore]
        public IList<Category> Subcategories { get; set; } = new List<Category>();
    }
}