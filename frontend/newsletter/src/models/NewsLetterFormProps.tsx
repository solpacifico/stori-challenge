import { FileInfo } from "../types/FileInfo";
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
    CurrentFileObject?:FileInfo
    FileUploadDoneHandler?:(FileObjectDTO:FileInfo) => void;
    SendNewsLetterNOWHandler?:(id:number) => void;
}