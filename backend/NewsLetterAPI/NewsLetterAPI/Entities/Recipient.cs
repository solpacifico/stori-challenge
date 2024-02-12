using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class Recipient
{
    public uint Id { get; set; }

    public string? Name { get; set; }

    public string Email { get; set; } = null!;
}
