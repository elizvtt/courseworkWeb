using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CartItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItem()
        {
            return await _context.CartItems.Include(ci => ci.Product).ToListAsync();
        }

        // GET: api/CartItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);

            if (cartItem == null)
            {
                return NotFound();
            }

            return cartItem;
        }

        // PUT: api/CartItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCartItem(int id, CartItem cartItem)
        {
            if (id != cartItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(cartItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartItemExists(id))
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

        // POST: api/CartItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CartItem>> PostCartItem(CartItem cartItem)
        {
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCartItem", new { id = cartItem.Id }, cartItem);
        }

              

        // DELETE: api/CartItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CartItemExists(int id)
        {
            return _context.CartItems.Any(e => e.Id == id);
        }

        // [HttpPost("Cart/{cartId}")]
        // public async Task<ActionResult<CartItem>> AddToCart(int cartId, AddToCartDto dto)
        // {
        //     var cart = await _context.Carts
        //                             .Include(c => c.CartItems)
        //                             .ThenInclude(ci => ci.Product)
        //                             .Include(c => c.Client)
        //                             .FirstOrDefaultAsync(c => c.Id == cartId);

        //     if (cart == null)
        //     {
        //         return NotFound(); 
        //     }

        //     var product = await _context.Products
        //                                 .FirstOrDefaultAsync(p => p.Id == dto.ProductId);

        //     // Создаем новый элемент корзины (CartItem)
        //     var cartItem = new CartItem
        //     {
        //         CartId = cartId,
        //         ProductId = dto.ProductId,
        //         Quantity = dto.Quantity,
        //         Cart = cart,
        //         Product = product
        //     };

        //     // Добавляем элемент корзины в таблицу
        //     _context.CartItems.Add(cartItem);

        //     // Сохраняем изменения в базе данных
        //     await _context.SaveChangesAsync();

        //     // return CreatedAtAction("GetCartItem", new { id = cartItem.Id }, cartItem);
        //     var createdCartItem = await _context.CartItems
        //                                 .Include(ci => ci.Product)
        //                                 .Include(ci => ci.Cart)
        //                                 .ThenInclude(c => c.Client)
        //                                 .FirstOrDefaultAsync(ci => ci.Id == cartItem.Id);

        //     return CreatedAtAction("GetCartItem", new { id = createdCartItem.Id }, createdCartItem);
        // }

        // POST: /api/CartItems/Cart/{cartId}
        [HttpPost("Cart/{cartId}")]
        public async Task<ActionResult<CartItem>> AddToCart(int cartId, AddToCartDto dto)
        {
            // Загружаем корзину с товарами
            var cart = await _context.Carts
                                    .Include(c => c.CartItems)
                                    .ThenInclude(ci => ci.Product)
                                    .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart == null)
            {
                return NotFound();
            }

            // Проверяем, существует ли продукт
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            // Проверяем, существует ли этот продукт в корзине
            var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);
            if (existingCartItem != null)
            {
                existingCartItem.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cartId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    Product = product // Связываем продукт
                };

                _context.CartItems.Add(cartItem);
            }

            // Сохраняем изменения
            await _context.SaveChangesAsync();

            // Возвращаем обновленную корзину с продуктами
            var updatedCartItem = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == dto.ProductId);

            return CreatedAtAction("GetCartItem", new { id = updatedCartItem.Id }, updatedCartItem);
        }

        // GET: /api/CartItems/Cart/{cartId}
        [HttpGet("Cart/{cartId}")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItemsByCartId(int cartId)
        {
            // Получаем корзину с ее элементами
            var cart = await _context.Carts
                                    .Include(c => c.CartItems)
                                    .ThenInclude(ci => ci.Product)
                                    .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            // Возвращаем все элементы корзины
            return Ok(cart.CartItems);
        }

        // DELETE: /api/CartItems/Cart/AllDelete/{cartId}
        [HttpDelete("Cart/AllDelete/{cartId}")]
        public async Task<IActionResult> ClearCart(int cartId)
        {
            var cartItems = _context.CartItems.Where(ci => ci.CartId == cartId);
            if (!cartItems.Any())
            {
                return NotFound(new { message = "No items in cart to clear." });
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: /api/CartItems/{id}/quantity
        [HttpPut("{id}/quantity")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int newQuantity)
        {
            // Найти CartItem по Id
            var cartItem = await _context.CartItems.FindAsync(id);
            
            if (cartItem == null)
            {
                return NotFound(new { message = "CartItem not found" });
            }

            cartItem.Quantity = newQuantity;

            await _context.SaveChangesAsync();

            return NoContent();
        }



    }
}
