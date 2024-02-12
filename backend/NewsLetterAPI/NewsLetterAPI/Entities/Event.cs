using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class Event
{
    public uint NewsLetterId { get; set; }

    public string TypeEvent { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public string? Reason { get; set; }

    public int Id { get; set; }
}
