using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsLetterAPI.DTO;
using NewsLetterAPI.Entities;

namespace NewsLetterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly NewsletterMsqlContext _context;

        public SchedulesController(NewsletterMsqlContext context)
        {
            _context = context;
        }

        // GET: api/Schedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleDTO>>> GetSchedules()
        {
            var schedules =  await _context.Schedules.ToListAsync();
            List<ScheduleDTO> result = new List<ScheduleDTO>();
            foreach (var schedule in schedules)
            {
                var schedulesDTO = new ScheduleDTO()
                {
                    ScheduleId = schedule.ScheduleId,
                    NewsLetterId = schedule.NewsLetterId,
                    Active = schedule.Active,
                    SendTime = schedule.SendTime,
                    SendWeekDay = schedule.SendWeekDay,
                    SendMonthDay = schedule.SendMonthDay,
                    SendDate = schedule.SendDate,
                    Repeat = schedule.Repeat,
                };
                result.Add(schedulesDTO);
            }
            return result;
        }

        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleDTO>> GetSchedule(uint id)
        {
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null)
            {
                return ControllerBase.Empty;
            }
            var schedulesDTO = new ScheduleDTO()
            {
                ScheduleId = schedule.ScheduleId,
                NewsLetterId = schedule.NewsLetterId,
                Active = schedule.Active,
                SendTime = schedule.SendTime,
                SendWeekDay = schedule.SendWeekDay,
                SendMonthDay = schedule.SendMonthDay,
                SendDate = schedule.SendDate,
                Repeat = schedule.Repeat,
            };

            return schedulesDTO;
        }

        // GET: api/Schedules/bynewsletter/5
        [HttpGet("bynewsletter/{id}")]        
        public async Task<ActionResult<ScheduleDTO>> GetSchedulebyNewsLetter(uint id)
        {
           // var schedule = await _context.Schedules.FindAsync(id);

            var schedule = await _context.Schedules
               .FromSql($"SELECT * FROM Schedules WHERE NewsLetterId = {id}").FirstAsync();

            if (schedule == null)
            {
                return ControllerBase.Empty;
            }
            var schedulesDTO = new ScheduleDTO()
            {
                ScheduleId = schedule.ScheduleId,
                NewsLetterId = schedule.NewsLetterId,
                Active = schedule.Active,
                SendTime = schedule.SendTime,
                SendWeekDay = schedule.SendWeekDay,
                SendMonthDay = schedule.SendMonthDay,
                SendDate = schedule.SendDate,
                Repeat = schedule.Repeat,
            };

            return schedulesDTO;
        }

        // PUT: api/Schedules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedule(uint id, ScheduleDTO scheduleDTO)
        {
            if (id != scheduleDTO.ScheduleId)
            {
                return BadRequest();
            }

            var entity = new Schedule()
            {
                ScheduleId = scheduleDTO.ScheduleId,
                NewsLetterId = scheduleDTO.NewsLetterId,
                Active = scheduleDTO.Active,
                SendTime = scheduleDTO.SendTime,
                SendWeekDay = scheduleDTO.SendWeekDay,
                SendMonthDay = scheduleDTO.SendMonthDay,
                SendDate = scheduleDTO.SendDate,
                Repeat = scheduleDTO.Repeat,
            };

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
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

        // POST: api/Schedules
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Schedule>> PostSchedule(ScheduleDTO scheduleDTO)
        {
            var entity = new Schedule()
            {
                ScheduleId = scheduleDTO.ScheduleId,
                NewsLetterId = scheduleDTO.NewsLetterId,
                Active = scheduleDTO.Active,
                SendTime = scheduleDTO.SendTime,
                SendWeekDay = scheduleDTO.SendWeekDay,
                SendMonthDay = scheduleDTO.SendMonthDay,
                SendDate = scheduleDTO.SendDate,
                Repeat = scheduleDTO.Repeat,
            };


            _context.Schedules.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSchedule", new { id = entity.ScheduleId }, entity);
        }

        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(uint id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(uint id)
        {
            return _context.Schedules.Any(e => e.ScheduleId == id);
        }
    }
}
