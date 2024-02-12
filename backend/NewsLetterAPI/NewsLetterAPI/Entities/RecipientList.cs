using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class RecipientList
{
    public uint NewsLetterId { get; set; }

    public uint RecipientId { get; set; }
}
