using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;

namespace courseworkWeb.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; } = default!;
        public DbSet<Cart> Carts { get; set; } = default!;
        public DbSet<AttributeGroup> AttributeGroups { get; set; } = default!;
        public DbSet<Category> Categories { get; set; } = default!;
        public DbSet<Attributes> Attributes{ get; set; } = default!;       
        public DbSet<Product> Products { get; set; } = default!;
        public DbSet<ProductImage> ProductImages { get; set; } = default!;
        public DbSet<ProductAttribute> ProductAttributes{ get; set; } = default!;
        public DbSet<Review> Reviews{ get; set; } = default!;
        public DbSet<CartItem> CartItems { get; set; } = default!;
        public DbSet<Orders> Orders { get; set; } = default!;
        public DbSet<DeliveryMethod> DeliveryMethods { get; set; } = default!;
        public DbSet<OrderItem> OrderItems { get; set;} = default!;

    }
}
