import  { NewsLetter }  from "../types/NewsLetter";
import  { Recipient }  from "../types/Recipient";
import { Schedule } from "../types/Sechedule";
import http from './htttp-common';

const getNewsLetterList = () =>{
    return http.get<Array<NewsLetter>>('/NewsLetterx');
}

function updateNewsLetter (id:number, newsLetterDTO:NewsLetter){
    return http.put<NewsLetter>(`/NewsLetterx/${id}`,newsLetterDTO);
}

function putUnsubscribe (id:number, newsLetterDTO:NewsLetter){
    return http.put<NewsLetter>(`/NewsLetterx/Unsubscribe/${id}`,newsLetterDTO);
}


function postNewsLetter ( newsLetterDTO:NewsLetter){
    return http.post<NewsLetter>(`/NewsLetterx/`,newsLetterDTO);
}

function postSuscribeList ( newsLetterDTO:NewsLetter){
    return http.post<NewsLetter>(`/NewsLetterx/SuscribeList/`,newsLetterDTO);
}

function sendNewsLetter( newsLetterId:number){
    return http.post<NewsLetter>(`/NewsLetterx/send?NewsLetterId=${newsLetterId}`);
}


function deleteNewsLetter (id:number){
    return http.delete<NewsLetter>(`/NewsLetterx/${id}`);
}

const getSchedule = (id:number) =>{
    return http.get<Array<Schedule>>(`/Schedules/${id}`);
}


const getScheduleByNewsletter = (id:number) =>{
    return http.get<Array<Schedule>>(`/Schedules/bynewsletter/${id}`);
}

const putSchedule = (id:number, scheduleDTO:Schedule) =>{
    return http.put<Schedule>(`/Schedules/${id}`,scheduleDTO);
}



function postSchedule ( scheduleDTO:Schedule){
    return http.post<Schedule>(`/Schedules/`,scheduleDTO);
}

function deleteSchedule (id:number){
    return http.delete<Schedule>(`/Schedules/${id}`);
}


const NewsLettterAPIService ={
    getNewsLetterList,    
    updateNewsLetter,
    postNewsLetter,
    deleteNewsLetter,
    postSuscribeList,
    putUnsubscribe,
    getSchedule,
    putSchedule,
    postSchedule,
    deleteSchedule,
    getScheduleByNewsletter,
    sendNewsLetter
    
};

export default NewsLettterAPIService;