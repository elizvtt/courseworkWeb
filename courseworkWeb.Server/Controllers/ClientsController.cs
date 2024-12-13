using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClient()
        {
            return await _context.Clients
                                    .Include(c => c.Orders)
                                        .ThenInclude(o => o.OrderItems)
                                    .ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients
                                    .Include(c => c.Orders)
                                        .ThenInclude(o => o.OrderItems)
                                            .ThenInclude(oi => oi.Product)
                                                .ThenInclude(p => p.ProductImages)
                                    .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // PUT: api/Clients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.Id)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
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

        
        [HttpPatch("UpdatePoints/{clientId}")]
        public async Task<IActionResult> UpdatePoints(int clientId, [FromBody] UpdatePointsRequest request)
        {
            var client = await _context.Clients.FindAsync(clientId);
            if (client == null)
            {
                return NotFound();
            }

            // Частично обновляем бонусные баллы
            client.BonusPoints += request.BonusPointsChange; // Здесь бонусы прибавляются или вычитаются
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();

            return Ok(client);
        }


        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            if (client == null)
            {
                return BadRequest("Client data is null");
            }

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClient", new { id = client.Id }, client);
        }
        
        
        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }

        
        [HttpGet("CheckEmail")]
        public async Task<IActionResult> CheckEmailExists([FromQuery] string email)
        {
            var user = await _context.Clients.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                return Ok(new { exists = true });
            }

            return Ok(new { exists = false });
        }

        [HttpGet("GetUserByEmail")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            try
            {
                // Проверяем, существует ли пользователь с таким email
                var user = await _context.Clients
                    .FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    // Если пользователь не найден, возвращаем 404
                    return NotFound(new { message = "Користувач з такою адресою не знайден" });
                }

                // Возвращаем данные пользователя (например, email и пароль)
                return Ok(new 
                {
                    user.Email,
                    user.Password,
                    user.Id
                });
            }
            catch
            {
                return StatusCode(500, new { message = "Виникла помилка на сервері" });
            }
        }


    }
}
