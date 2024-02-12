export interface Schedule{
    scheduleId: number,
    newsLetterId: number,
    active: boolean,
    sendTime: Date
    sendWeekDay: number,
    sendMonthDay: number,
    sendDate: Date,
    repeat: boolean
  }
