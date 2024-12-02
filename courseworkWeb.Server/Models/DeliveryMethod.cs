using System.ComponentModel.DataAnnotations;

namespace WebCoursework.Server.Models
{
    public class DeliveryMethod
    {
        [Key]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required decimal Cost { get; set; }

        public required IList<Orders> Orders { get; set; }
    }
}
