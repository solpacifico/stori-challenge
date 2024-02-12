using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsLetterAPI.Entities;

namespace NewsLetterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipientListsController : ControllerBase
    {
        private readonly NewsletterMsqlContext _context;

        public RecipientListsController(NewsletterMsqlContext context)
        {
            _context = context;
        }

        // GET: api/RecipientLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipientList>>> GetRecipientLists()
        {
            return await _context.RecipientLists.ToListAsync();
        }

        // GET: api/RecipientLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipientList>> GetRecipientList(uint id)
        {
            var recipientList = await _context.RecipientLists.FindAsync(id);

            if (recipientList == null)
            {
                return NotFound();
            }

            return recipientList;
        }

        // PUT: api/RecipientLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipientList(uint id, RecipientList recipientList)
        {
            if (id != recipientList.NewsLetterId)
            {
                return BadRequest();
            }

            _context.Entry(recipientList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipientListExists(id))
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

        // POST: api/RecipientLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RecipientList>> PostRecipientList(RecipientList recipientList)
        {
            _context.RecipientLists.Add(recipientList);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RecipientListExists(recipientList.NewsLetterId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRecipientList", new { id = recipientList.NewsLetterId }, recipientList);
        }

        // DELETE: api/RecipientLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipientList(uint id)
        {
            var recipientList = await _context.RecipientLists.FindAsync(id);
            if (recipientList == null)
            {
                return NotFound();
            }

            _context.RecipientLists.Remove(recipientList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecipientListExists(uint id)
        {
            return _context.RecipientLists.Any(e => e.NewsLetterId == id);
        }
    }
}
