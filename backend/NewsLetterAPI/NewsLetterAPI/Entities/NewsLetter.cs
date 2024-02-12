using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class NewsLetter
{
    public uint Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Template { get; set; }

    public string? Attachment { get; set; }

    public string? Customer { get; set; }

}
