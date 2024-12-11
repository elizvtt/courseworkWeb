using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebCoursework.Server.Models;
using courseworkWeb.Server.Data;

namespace courseworkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductAttributesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductAttributesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductAttributes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductAttribute>>> GetProductAttribute()
        {
            return await _context.ProductAttributes
                                                .Include(pa => pa.Attribute)
                                                    .ThenInclude(a => a.AttributeGroup)
                                                .ToListAsync();
        }

        // GET: api/ProductAttributes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductAttribute>> GetProductAttribute(int id)
        {
            var productAttribute = await _context.ProductAttributes.FindAsync(id);

            if (productAttribute == null)
            {
                return NotFound();
            }

            return productAttribute;
        }

        // PUT: api/ProductAttributes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductAttribute(int id, ProductAttribute productAttribute)
        {
            if (id != productAttribute.Id)
            {
                return BadRequest();
            }

            _context.Entry(productAttribute).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductAttributeExists(id))
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

        // POST: api/ProductAttributes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductAttribute>> PostProductAttribute(ProductAttribute productAttribute)
        {
            _context.ProductAttributes.Add(productAttribute);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductAttribute", new { id = productAttribute.Id }, productAttribute);
        }

        // DELETE: api/ProductAttributes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductAttribute(int id)
        {
            var productAttribute = await _context.ProductAttributes.FindAsync(id);
            if (productAttribute == null)
            {
                return NotFound();
            }

            _context.ProductAttributes.Remove(productAttribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductAttributeExists(int id)
        {
            return _context.ProductAttributes.Any(e => e.Id == id);
        }
    }
}
