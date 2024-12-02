using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebCoursework.Server.Models
{
    public class Attributes
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        
        [ForeignKey("AttributeGroup")]
        public required int AttributeGroupId { get; set; }
        
        [ForeignKey("Category")]
        public required int CategoryId { get; set; }

        public required AttributeGroup AttributeGroup{ get; set; }
        public required Category Category{ get; set; }
    }
}
