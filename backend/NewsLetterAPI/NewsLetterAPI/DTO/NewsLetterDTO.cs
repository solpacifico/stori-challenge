namespace NewsLetterAPI.DTO
{
    public class NewsLetterDTO
    {
        public uint Id { get; set; }

        public string? Name { get; set; } 

        public string? Description { get; set; }

        public string? Template { get; set; }

        public string? Attachment { get; set; }

        public string? Customer { get; set; }

        public List<RecipientDTO>? Recipients { get; set; }
    }
}
