﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebCoursework.Server.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Product")]
        public required int ProductId { get; set; }

        [ForeignKey("Cart")]
        public required int CartId { get; set; }
        public required int Quantity { get; set; }

        public required Product Product { get; set; }
        
        [JsonIgnore]
        // public required Cart Cart { get; set; }
        public Cart? Cart { get; set; }
    }

}
