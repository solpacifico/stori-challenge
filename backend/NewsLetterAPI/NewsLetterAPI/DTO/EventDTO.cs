namespace NewsLetterAPI.DTO
{
    public class EventDTO
    {

        public uint NewsLetterId { get; set; }

        public string? TypeEvent { get; set; } 

        public string? Email { get; set; }  

        public DateTime EventDate { get; set; }

        public string? Reason { get; set; }
    }
}
