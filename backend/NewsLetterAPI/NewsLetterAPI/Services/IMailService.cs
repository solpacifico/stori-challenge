using NewsLetterAPI.Models;

namespace NewsLetterAPI.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
        
    }
}
