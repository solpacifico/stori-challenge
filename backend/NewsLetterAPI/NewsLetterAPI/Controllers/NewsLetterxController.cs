using MailKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsLetterAPI.DTO;
using NewsLetterAPI.Entities;
using NewsLetterAPI.Models;
using NewsLetterAPI.Services;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Configuration;
using System.IO;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.Json;

namespace NewsLetterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsLetterxController : ControllerBase
    {
        private readonly NewsletterMsqlContext _context;
        private readonly Services.IMailService _mailService;
        private IConfiguration _configuration;

        public NewsLetterxController(NewsletterMsqlContext context, Services.IMailService mailService, IConfiguration configuration)
        {
            _context = context;
            _mailService = mailService;
            _configuration = configuration;
        }  
        

        // GET: api/NewsLetterx
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsLetterDTO>>> GetNewsLetterDTO()
        {
            var newsLetters =   await _context.NewsLetters.ToListAsync();
            List<NewsLetterDTO> res = new List<NewsLetterDTO>();
            foreach (var newsLetter in newsLetters)
            {
                var newsLetterDTO = new NewsLetterDTO()
                {
                    Name = newsLetter.Name,
                    Description = newsLetter.Description,
                    Template = newsLetter.Template,
                    Customer = newsLetter.Customer,
                    Attachment = newsLetter.Attachment,
                    Id = newsLetter.Id,
                    Recipients = GetRecipientList(newsLetter.Id)

                };
                res.Add(newsLetterDTO);
            }
           return res;
        }

        // GET: api/NewsLetterx/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsLetterDTO>> GetNewsLetterDTO(uint id)
        {
            var newsLetter = await _context.NewsLetters.FindAsync(id);

            if (newsLetter == null)
            {
                return NotFound();
            }

            var newsLetterDTO = new NewsLetterDTO()
            {
                Name = newsLetter.Name,
                Description = newsLetter.Description,
                Template = newsLetter.Template,
                Customer = newsLetter.Customer,
                Attachment = newsLetter.Attachment,
                Id = newsLetter.Id,
                Recipients = GetRecipientList(id)

            };


            return newsLetterDTO;
        }

        // PUT: api/NewsLetterx/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNewsLetterDTO(int id, NewsLetterDTO newsLetterDTO)
        {
            if (id != newsLetterDTO.Id)
            {
                return BadRequest();
            }

            var entity = new NewsLetter()
            {
                Name = newsLetterDTO.Name,
                Description = newsLetterDTO.Description,
                Template = newsLetterDTO.Template,
                Customer = newsLetterDTO.Customer,
                Attachment = newsLetterDTO.Attachment,
                Id = newsLetterDTO.Id
            };

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NewsLetterExists(id))
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

        // PUT: api/Unsubscribe/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpPut("Unsubscribe/{id}")]        
        public async Task<IActionResult> Unsubscribe(int id, NewsLetterDTO newsLetterDTO)
        {
            if (id != newsLetterDTO.Id)
            {
                return BadRequest();
            }

            if (newsLetterDTO.Recipients is null && newsLetterDTO.Recipients.Count != 1)
            {
                return BadRequest();
            }           
            
            
            var RecipientList = _context.RecipientLists
                .FromSql($"SELECT * FROM RecipientLists WHERE NewsLetterID = {newsLetterDTO.Id} AND RecipientID = {newsLetterDTO.Recipients[0].Id}").ToList();

            if (RecipientList.Any())
            {
                _context.RecipientLists.RemoveRange(RecipientList);
                await _context.SaveChangesAsync();

                EventDTO log = new EventDTO()
                {
                    Email = newsLetterDTO.Recipients[0].Email,
                    NewsLetterId = newsLetterDTO.Id,
                    Reason = "",
                    TypeEvent = "UNSUBSCRIBE"
                };
                await logEvent(log);

            }       
               
            return NoContent();
        }

        // PUT: api/Unsubscribe/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpPut("Unsubscribe")]
        public async Task<IActionResult> UnsubscribeByrec(int id, string email)
        {
            if (id == 0 || email == "")
            {
                return BadRequest();
            }

            uint idRecipient = GetEmailID(email);

           
            var RecipientList = _context.RecipientLists
                .FromSql($"SELECT * FROM RecipientLists WHERE NewsLetterID = {id} AND RecipientID = {idRecipient}").ToList();

            if (RecipientList.Any())
            {
                _context.RecipientLists.RemoveRange(RecipientList);
                await _context.SaveChangesAsync();

                EventDTO log = new EventDTO()
                {
                    Email = email,
                    NewsLetterId = (uint)id,
                    Reason = "",
                    TypeEvent = "SELF UNSUBSCRIBE"
                };
                await logEvent(log);

            }

            return NoContent();
        }


        // POST: api/SuscribeList
        [HttpPost]
        [Route("SuscribeList")]
        public async Task<ActionResult<NewsLetterDTO>> PostRecipientListDTO(NewsLetterDTO newsLetterDTO)
        {
            if (newsLetterDTO.Recipients != null)
            {

                foreach (RecipientDTO recipientDTO in newsLetterDTO.Recipients)
                {
                    //Avoid Email duplicates
                    uint RecId = GetEmailID(recipientDTO.Email);

                    if (RecId == 0)
                    {
                        var recipient = new Recipient
                        {
                            Email = recipientDTO.Email,
                            Name = recipientDTO.Name,
                            Id = 0
                        };
                        var newRecipient = _context.Add(recipient);
                        await _context.SaveChangesAsync();
                        RecId = newRecipient.Entity.Id;
                    }

                    //Add the association between recipient and newsletter
                    var recList = await _context.RecipientLists.FindAsync([newsLetterDTO.Id, RecId]);
                    if (recList == null)
                    {
                        var recipientList = new RecipientList
                        {
                            NewsLetterId = newsLetterDTO.Id,
                            RecipientId = RecId
                        };
                        _context.Add(recipientList);
                        await _context.SaveChangesAsync();
                    }

                    EventDTO log = new EventDTO()
                    {
                        Email = recipientDTO.Email,
                        NewsLetterId = newsLetterDTO.Id,
                        Reason = "",
                        TypeEvent = "SUBSCRIBE"
                    };
                    await logEvent(log);
                }


            }                            

            return NoContent();
        }
        // POST: api/NewsLetterx
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NewsLetterDTO>> PostNewsLetterDTO(NewsLetterDTO newsLetterDTO)
        {
            var entity = new NewsLetter()
            {
                Name = newsLetterDTO.Name,
                Description = newsLetterDTO.Description,
                Template = newsLetterDTO.Template,
                Customer = newsLetterDTO.Customer,
                Attachment = newsLetterDTO.Attachment,
                Id = 0
            };
            
            var newNewsLetter = _context.NewsLetters.Add(entity);
            
            await _context.SaveChangesAsync();

            if(newsLetterDTO.Recipients != null)
            {
                
                foreach(RecipientDTO recipientDTO in newsLetterDTO.Recipients)
                {
                    //Avoid Email duplicates
                    uint RecId = GetEmailID(recipientDTO.Email);
                    
                    if (RecId == 0)
                    {
                        var recipient = new Recipient
                        {
                            Email = recipientDTO.Email,
                            Name = recipientDTO.Name,
                            Id = 0
                        };
                        var newRecipient = _context.Add(recipient);
                        
                        await _context.SaveChangesAsync();
                        RecId = newRecipient.Entity.Id;
                    }

                    //Add the association between recipient and newsletter   
                    //Also Avoid Duplicates
                    var recList = await _context.RecipientLists.FindAsync([newNewsLetter.Entity.Id, RecId]);
                    if (recList == null)
                    {
                        var recipientList = new RecipientList
                        {
                            NewsLetterId = newNewsLetter.Entity.Id,
                            RecipientId = RecId
                        };
                        _context.Add(recipientList);
                        await _context.SaveChangesAsync();
                    }
                    
                }       
                       
            
            }

            return CreatedAtAction("GetNewsLetterDTO", new { id = newsLetterDTO.Id }, newsLetterDTO);
        }


        [HttpPost("send")]
        public async Task<IActionResult> SendNewsLetter(uint NewsLetterId)
        {
            try
            {
                MailRequest mailRequest = await CreateRequest(NewsLetterId);
                var emails = _context.Recipients
                .FromSql($"SELECT R.* FROM Recipients R INNER JOIN RecipientLists RL ON RL.RecipientID = R.Id WHERE RL.NewsLetterID = {NewsLetterId}").ToList();
                foreach (var email in emails)
                {
                    mailRequest.ToEmail = email.Email;
                    mailRequest.Body.Replace("href=\"#\"", GetUunsubscribeLink(NewsLetterId,email.Email));
                    await _mailService.SendEmailAsync(mailRequest);
                    EventDTO log = new EventDTO() {
                        Email = email.Email,    
                        NewsLetterId = NewsLetterId,
                        Reason="",
                        TypeEvent="MAIL_SENT"                        
                    };
                    await logEvent(log);
                }

                
                return Ok();
            }
            catch (Exception ex)
            {

                throw;
            }



           

        }

        private string GetUunsubscribeLink(uint newsLetterId, string email)
        {
            string baseUrl = _configuration.GetValue<string>("UnsubscribeHost:baseUrl");
            return $"href=\"{baseUrl}/api/NewsLetterx/Unsubscribe?id={newsLetterId}&email={email}\"";
        }


        // DELETE: api/NewsLetterx/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNewsLetterDTO(uint id)
        {
            var newsLetterDTO = await _context.NewsLetters.FindAsync(id);
            if (newsLetterDTO == null)
            {
                return NotFound();
            }

            await DeleteRecipientList(newsLetterDTO.Id);            
            _context.NewsLetters.Remove(newsLetterDTO);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NewsLetterExists(int id)
        {
            return _context.NewsLetters.Any(e => e.Id == id);
        }

        private bool CheckRecipientEmailExist(string email)
        {
            var emails = _context.Recipients
                .FromSql($"SELECT 1 FROM Recipients WHERE Email = {email}");
            if (emails is null)
            {
                return false;
            }
            else
            {
                return true;
            }
                  
        }

        private uint GetEmailID(string email)
        {
            var emails = _context.Recipients
                .FromSql($"SELECT * FROM Recipients WHERE Email = {email}").ToList();
            if (emails.Count ==  0)
            {
                return 0;
            }
            else
            {
                return emails[0].Id;
            }

        }

        private List<RecipientDTO> GetRecipientList(uint NewsLetterId)
        {
            var emails = _context.Recipients
                .FromSql($"SELECT R.* FROM Recipients R INNER JOIN RecipientLists RL ON RL.RecipientID = R.Id WHERE RL.NewsLetterID = {NewsLetterId}").ToList();
                 

            List<RecipientDTO> emailsDTO = new List<RecipientDTO>();

            foreach (Recipient email in emails)
            {
                RecipientDTO recipient = new RecipientDTO() { 
                    Id = email.Id,
                    Email = email.Email,
                    Name = email.Name,
                };
                emailsDTO.Add(recipient);
            }            
            return emailsDTO;           
        }


        private async Task<bool> DeleteRecipientList(uint NewsLetterId)
        {
            var RecipientList = _context.RecipientLists
               .FromSql($"SELECT * FROM RecipientLists WHERE NewsLetterID = {NewsLetterId}").ToList();

            if (!RecipientList.Any()) 
            {
                _context.RecipientLists.RemoveRange(RecipientList);
                await _context.SaveChangesAsync();
                return true;
            }

            //Not Found
            return false;

        }

        private async Task<MailRequest> CreateRequest(uint newsletterid)
        { 
            var newsLetter = await _context.NewsLetters.FindAsync(newsletterid);

            if (newsLetter != null)
            {
                MailRequest mailRequest = new MailRequest()
                {
                    Subject = newsLetter.Description,
                    Body = newsLetter.Template,
                    ToEmail = "",
                    Attachments = new List<IFormFile>()                    
                };
                if (newsLetter.Attachment != null && newsLetter.Attachment != "")
                {
                    try
                    {
                        FileObject? fileObject = JsonSerializer.Deserialize<FileObject>(newsLetter.Attachment);

                        if (fileObject != null)
                        {
                            Uri url = new(fileObject.url);
                            using (WebClient client = new WebClient())
                            {
                                var file = new MemoryStream(client.DownloadData(url));
                                FormFile formFile = new FormFile(file, 0, file.Length, null, fileObject.filename)
                                {
                                    Headers = new HeaderDictionary()
                                }; 
                                formFile.ContentType = fileObject.mimetype;
                                mailRequest.Attachments.Add(formFile);
                            }
                        }
                    }
                    catch
                    { 
                        return mailRequest;
                    }                   

                }

                
                return mailRequest;
            }
            return null;            
        }

        private async Task<bool> logEvent(EventDTO eventDTO) {

            var entity = new Event() {
                Email = eventDTO.Email,
                EventDate = DateTime.Now,
                NewsLetterId = eventDTO.NewsLetterId,
                Reason = eventDTO.Reason,
                TypeEvent = eventDTO.TypeEvent,
                Id = 0
            };
            
            _context.Events.Add(entity);
            await _context.SaveChangesAsync();
            return true;
        
        }


    }
}
