// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using WebCoursework.Server.Models;
// using courseworkWeb.Server.Data;

// namespace courseworkWeb.Server.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class OrdersController : ControllerBase
//     {
//         private readonly ApplicationDbContext _context;

//         public OrdersController(ApplicationDbContext context)
//         {
//             _context = context;
//         }

//         // GET: api/Orders
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<Orders>>> GetOrders()
//         {
//             return await _context.Orders.ToListAsync();
//         }

//         // GET: api/Orders/5
//         [HttpGet("{id}")]
//         public async Task<ActionResult<Orders>> GetOrders(int id)
//         {
//             var orders = await _context.Orders.FindAsync(id);

//             if (orders == null)
//             {
//                 return NotFound();
//             }

//             return orders;
//         }

//         // PUT: api/Orders/5
//         // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//         [HttpPut("{id}")]
//         public async Task<IActionResult> PutOrders(int id, Orders orders)
//         {
//             if (id != orders.Id)
//             {
//                 return BadRequest();
//             }

//             _context.Entry(orders).State = EntityState.Modified;

//             try
//             {
//                 await _context.SaveChangesAsync();
//             }
//             catch (DbUpdateConcurrencyException)
//             {
//                 if (!OrdersExists(id))
//                 {
//                     return NotFound();
//                 }
//                 else
//                 {
//                     throw;
//                 }
//             }

//             return NoContent();
//         }

//         // POST: api/Orders
//         // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//         // [HttpPost]
//         // public async Task<ActionResult<Orders>> PostOrders(Orders orders)
//         // {
//         //     _context.Orders.Add(orders);
//         //     await _context.SaveChangesAsync();

//         //     return CreatedAtAction("GetOrders", new { id = orders.Id }, orders);
//         // }

//         [HttpPost]
//         public IActionResult CreateOrder([FromBody] CreateOrderDTO dto)
//         {
//             // Получение клиента по ID
//             var client = _context.Clients.Find(dto.ClientId);
//             if (client == null)
//             {
//                 return BadRequest("Invalid ClientId");
//             }

//             // Получение метода доставки по ID
//             var deliveryMethod = _context.DeliveryMethods.Find(dto.DeliveryMethodId);
//             if (deliveryMethod == null)
//             {
//                 return BadRequest("Invalid DeliveryMethodId");
//             }

//             // Создание нового заказа
//             var order = new Orders
//             {
//                 ClientId = dto.ClientId,
//                 Client = client,
//                 Address = dto.Address,
//                 DeliveryMethodId = dto.DeliveryMethodId,
//                 DeliveryMethod = deliveryMethod,
//                 PaymentMethod = dto.PaymentMethod,
//                 OrderDate = DateTime.Now,
//                 TotalAmount = dto.TotalAmount,
//                 Status = "В обробці",
//                  OrderItems = new List<OrderItem>()
//             };

//             // Сохранение заказа в базе данных
//             _context.Orders.Add(order);
//             _context.SaveChanges();

//             return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
//         }


//         // DELETE: api/Orders/5
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteOrders(int id)
//         {
//             var orders = await _context.Orders.FindAsync(id);
//             if (orders == null)
//             {
//                 return NotFound();
//             }

//             _context.Orders.Remove(orders);
//             await _context.SaveChangesAsync();

//             return NoContent();
//         }

//         private bool OrdersExists(int id)
//         {
//             return _context.Orders.Any(e => e.Id == id);
//         }
//     }
// }



using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Orders>>> GetOrders()
        {
            return await _context.Orders.Include(o => o.Client)
                                         .Include(o => o.DeliveryMethod)
                                         .Include(o => o.OrderItems)
                                            .ThenInclude(oi => oi.Product)
                                                .ThenInclude(p => p.ProductImages)
                                         .ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Orders>> GetOrders(int id)
        {
            var orders = await _context.Orders.Include(o => o.Client)
                                               .Include(o => o.DeliveryMethod)
                                               .FirstOrDefaultAsync(o => o.Id == id);

            if (orders == null)
            {
                return NotFound();
            }

            return orders;
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrders(int id, Orders orders)
        {
            if (id != orders.Id)
            {
                return BadRequest();
            }

            _context.Entry(orders).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrdersExists(id))
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

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO dto)
        {
            // Получение клиента по ID
            var client = await _context.Clients.FindAsync(dto.ClientId);
            if (client == null)
            {
                return BadRequest("Invalid ClientId");
            }

            // Получение метода доставки по ID
            var deliveryMethod = await _context.DeliveryMethods.FindAsync(dto.DeliveryMethodId);
            if (deliveryMethod == null)
            {
                return BadRequest("Invalid DeliveryMethodId");
            }

            // Создание нового заказа
            var order = new Orders
            {
                ClientId = dto.ClientId,
                Client = client,
                Address = dto.Address,
                DeliveryMethodId = dto.DeliveryMethodId,
                DeliveryMethod = deliveryMethod,
                PaymentMethod = dto.PaymentMethod,
                OrderDate = DateTime.UtcNow,
                TotalAmount = dto.TotalAmount,
                Status = "В обробці",
                OrderItems = new List<OrderItem>() // Инициализация коллекции
            };

            // Сохранение заказа в базе данных
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrders(int id)
        {
            var orders = await _context.Orders.FindAsync(id);
            if (orders == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(orders);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrdersExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
