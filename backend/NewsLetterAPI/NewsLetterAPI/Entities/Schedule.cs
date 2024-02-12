using System;
using System.Collections.Generic;

namespace NewsLetterAPI.Entities;

public partial class Schedule
{
    public uint ScheduleId { get; set; }

    public uint NewsLetterId { get; set; }

    public bool? Active { get; set; }

    public DateTime? SendTime { get; set; }

    public ushort? SendWeekDay { get; set; }

    public short? SendMonthDay { get; set; }

    public DateTime? SendDate { get; set; }

    public bool? Repeat { get; set; }
}
