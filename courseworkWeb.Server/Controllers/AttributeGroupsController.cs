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
    public class AttributeGroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttributeGroupsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AttributeGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttributeGroup>>> GetAttributeGroup()
        {
            return await _context.AttributeGroups.ToListAsync();
        }

        // GET: api/AttributeGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttributeGroup>> GetAttributeGroup(int id)
        {
            var attributeGroup = await _context.AttributeGroups.FindAsync(id);

            if (attributeGroup == null)
            {
                return NotFound();
            }

            return attributeGroup;
        }

        // PUT: api/AttributeGroups/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttributeGroup(int id, AttributeGroup attributeGroup)
        {
            if (id != attributeGroup.Id)
            {
                return BadRequest();
            }

            _context.Entry(attributeGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttributeGroupExists(id))
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

        // POST: api/AttributeGroups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AttributeGroup>> PostAttributeGroup(AttributeGroup attributeGroup)
        {
            _context.AttributeGroups.Add(attributeGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttributeGroup", new { id = attributeGroup.Id }, attributeGroup);
        }

        // DELETE: api/AttributeGroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttributeGroup(int id)
        {
            var attributeGroup = await _context.AttributeGroups.FindAsync(id);
            if (attributeGroup == null)
            {
                return NotFound();
            }

            _context.AttributeGroups.Remove(attributeGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttributeGroupExists(int id)
        {
            return _context.AttributeGroups.Any(e => e.Id == id);
        }
    }
}
