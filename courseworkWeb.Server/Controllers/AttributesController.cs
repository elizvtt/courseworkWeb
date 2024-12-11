
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttributesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttributesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Attributes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attributes>>> GetAttributes()
        {
            return await _context.Attributes.ToListAsync();
        }

        // GET: api/Attributes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attributes>> GetAttributes(int id)
        {
            var attributes = await _context.Attributes.FindAsync(id);

            if (attributes == null)
            {
                return NotFound();
            }

            return attributes;
        }

        // PUT: api/Attributes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttributes(int id, Attributes attributes)
        {
            if (id != attributes.Id)
            {
                return BadRequest();
            }

            _context.Entry(attributes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttributesExists(id))
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

        // POST: api/Attributes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attributes>> PostAttributes(Attributes attributes)
        {
            _context.Attributes.Add(attributes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttributes", new { id = attributes.Id }, attributes);
        }

        // DELETE: api/Attributes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttributes(int id)
        {
            var attributes = await _context.Attributes.FindAsync(id);
            if (attributes == null)
            {
                return NotFound();
            }

            _context.Attributes.Remove(attributes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttributesExists(int id)
        {
            return _context.Attributes.Any(e => e.Id == id);
        }
    }
}
