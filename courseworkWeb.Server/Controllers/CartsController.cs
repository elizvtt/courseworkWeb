using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CartsController> _logger;

        public CartsController(ApplicationDbContext context, ILogger<CartsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart()
        {
            return await _context.Carts
                                    .Include(c => c.Client)
                                    .Include(c => c.CartItems)
                                    .ToListAsync();
        }


        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            var cart = await _context.Carts.FindAsync(id);

            if (cart == null)
            {
                return NotFound();
            }

            return cart;
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(int id, Cart cart)
        {
            if (id != cart.Id)
            {
                return BadRequest();
            }

            _context.Entry(cart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartExists(id))
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

        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cart>> PostCart(Cart cart)
        {
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCart", new { id = cart.Id }, cart);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null)
            {
                return NotFound();
            }

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.Id == id);
        }

        [HttpPost("Client/{clientId}")]
        public async Task<ActionResult<Cart>> CreateCartForClient(int clientId)
        {
            var client = await _context.Clients.FindAsync(clientId);
            if (client == null)
            {
                return NotFound("Client not found");
            }

            // Если корзина не найдена, создаем новую
            var existingCart = await _context.Carts.FirstOrDefaultAsync(c => c.ClientId == clientId);
            if (existingCart != null)
            {
                return Ok(existingCart); // Если корзина существует, возвращаем её
            }

            var cart = new Cart
            {
                ClientId = clientId,
                Client = client,
                CartItems = new List<CartItem>()
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCartForClient", new { clientId = cart.ClientId }, cart);
        }


        [HttpGet("Client/{clientId}")]
        public async Task<ActionResult<Cart>> GetCartForClient(int clientId)
        {
            var cart = await _context.Carts
                                        .Where(c => c.ClientId == clientId)
                                        .Include(c => c.Client) 
                                        .Include(c => c.CartItems)
                                            .ThenInclude(ci => ci.Product)
                                        .FirstOrDefaultAsync(c => c.ClientId == clientId);

            if (cart == null)
            {
                var client = await _context.Clients.FindAsync(clientId);
                if (client == null)
                {
                    return NotFound("Client not found");
                }

                cart = new Cart
                {
                    ClientId = clientId,
                    Client = client,
                    CartItems = new List<CartItem>()
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return Ok(cart);
        }
    }
}
