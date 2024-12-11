using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class AttributeGroup
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }

        // [JsonIgnore]
        public IList<Attributes> Attributes { get; set; } = new List<Attributes>();
    }
}
