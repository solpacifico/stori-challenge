import { Schedule } from "../types/Sechedule";

export interface ScheduleFormProps{
    ScheduleDTO?:Schedule;
    onSubmitHandle?:(values:Schedule)=> void;
}