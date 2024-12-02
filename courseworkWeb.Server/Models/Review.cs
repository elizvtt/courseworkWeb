using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCoursework.Server.Models
{
    public class Review
    {
        [Key]
        public required int Id { get; set; }
        
        [ForeignKey("Product")]
        public required int ProductId { get; set; }
        
        [ForeignKey("Client")]
        public required int ClientId { get; set; }
        public required string Comment { get; set; }
        public required int Reting { get; set; }
        public DateTime Date { get; set; }

        public required Product Product{ get; set; }
        public required Client Client{ get; set; }

    }
}
