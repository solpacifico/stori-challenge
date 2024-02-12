using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class User
{
    public uint Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool? Admin { get; set; }
}
