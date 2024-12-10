using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderItem()
        {
            return await _context.OrderItems
                                        .Include(oi => oi.Product)
                                            .ThenInclude(p => p.ProductImages)
                                        .ToListAsync();
        }

        // GET: api/OrderItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItem>> GetOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);

            if (orderItem == null)
            {
                return NotFound();
            }

            return orderItem;
        }

        // PUT: api/OrderItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderItem(int id, OrderItem orderItem)
        {
            if (id != orderItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(orderItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OrderItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPost]
        // public async Task<ActionResult<OrderItem>> PostOrderItem(OrderItem orderItem)
        // {
        //     _context.OrderItems.Add(orderItem);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction("GetOrderItem", new { id = orderItem.Id }, orderItem);
        // }

        // DELETE: api/OrderItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderItemExists(int id)
        {
            return _context.OrderItems.Any(e => e.Id == id);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSimpleOrderItem([FromBody] OrderItemCreateDto orderItemDto)
        {
            if (orderItemDto == null)
            {
                return BadRequest("Invalid order item data.");
            }

            var product = await _context.Products.FindAsync(orderItemDto.ProductId);
            if (product == null)
            {
                return BadRequest("Invalid product ID.");
            }


            // Создаем сущность OrderItem из DTO
            var orderItem = new OrderItem
            {
                OrderId = orderItemDto.OrderId,
                ProductId = orderItemDto.ProductId,
                Quantity = orderItemDto.Quantity,
                PriceAtPurchase = orderItemDto.PriceAtPurchase,
                Product = product
            };

            // Сохраняем в базу данных
            try
            {
                _context.OrderItems.Add(orderItem);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetOrderItem", new { id = orderItem.Id }, orderItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
