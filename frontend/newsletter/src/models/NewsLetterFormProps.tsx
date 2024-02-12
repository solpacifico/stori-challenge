import  { NewsLetter }  from "../types/NewsLetter";
import { Recipient } from "../types/Recipient";
import { Schedule } from "../types/Sechedule";

export interface NewsLetterFormProps{

    NewsLetterDTO?:NewsLetter;
    handleReturnToList?:()=> void;
    handleToSave?:(objectToSave:NewsLetter)=>void;
    NewNewsLetter?:boolean;
    handleAddToEmailList?:(emailList:Recipient[])=> void;
    handleDeleteEmail?:(id:number)=> void;
    ScheduleDTO?:Schedule;
    handleScheduleSubmit?:(ScheduleDTO:Schedule)=>void;

}