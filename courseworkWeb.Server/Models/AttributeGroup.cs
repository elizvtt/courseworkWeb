using System.ComponentModel.DataAnnotations;

namespace WebCoursework.Server.Models
{
    public class AttributeGroup
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}
