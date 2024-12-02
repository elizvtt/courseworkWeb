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
    public class DeliveryMethodsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeliveryMethodsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DeliveryMethods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryMethod>>> GetDeliveryMethod()
        {
            return await _context.DeliveryMethods.ToListAsync();
            // var deliveryMethods = await _context.DeliveryMethods.ToListAsync();
            // return Ok(deliveryMethods);  // Возвращаем данные в формате JSON
        }

        // GET: api/DeliveryMethods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryMethod>> GetDeliveryMethod(int id)
        {
            var deliveryMethod = await _context.DeliveryMethods.FindAsync(id);

            if (deliveryMethod == null)
            {
                return NotFound();
            }

            return deliveryMethod;
        }

        // PUT: api/DeliveryMethods/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryMethod(int id, DeliveryMethod deliveryMethod)
        {
            if (id != deliveryMethod.Id)
            {
                return BadRequest();
            }

            _context.Entry(deliveryMethod).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryMethodExists(id))
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

        // POST: api/DeliveryMethods
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DeliveryMethod>> PostDeliveryMethod(DeliveryMethod deliveryMethod)
        {
            _context.DeliveryMethods.Add(deliveryMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDeliveryMethod", new { id = deliveryMethod.Id }, deliveryMethod);
        }

        // DELETE: api/DeliveryMethods/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryMethod(int id)
        {
            var deliveryMethod = await _context.DeliveryMethods.FindAsync(id);
            if (deliveryMethod == null)
            {
                return NotFound();
            }

            _context.DeliveryMethods.Remove(deliveryMethod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeliveryMethodExists(int id)
        {
            return _context.DeliveryMethods.Any(e => e.Id == id);
        }
    }
}
