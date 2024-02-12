import React,{useEffect, useState, useRef, LegacyRef, HTMLAttributeAnchorTarget} from "react";
import  { NewsLetter }  from "../types/NewsLetter";
import NewsLettterAPIService from "../services/NewsLetterAPIService";
import { NewsLetterList } from "../components/NewsLetterList";
import {NewsLetterForm} from    "../components/NewsLetterForm";
import { Button, Flex, FloatButton, Space } from "antd";
import { FileAddOutlined  } from '@ant-design/icons';
import { RecipientList } from "../components/RecipientList";
import { Recipient } from "../types/Recipient";
import { arrayBuffer } from "stream/consumers";
import { Schedule } from "../types/Sechedule";


/**
 * News Lettter List compornent Page
 * @returns 
 */
const NewsLetterPage:React.FC=()=>{

    /**
     * State Definitions
     * 
     */

    const [NewsLetterListDTO, setNewsLetterListDTO] =  useState<Array<NewsLetter>>([]);
    const [DetailMode, setDetailMode] =  useState(0);
    const [CurrentNewsLetter, setCurrentNewsLetter] = useState<NewsLetter>();
    const [NewNewsLetter, setNewNewsLetter ] =useState(false);
    const [ScheduleDTO,setScheduleDTO] = useState<Schedule>();



    /**
     * Bind Events
     */

    /**
     * Invoke Services     
     */

    useEffect(() => {
        getNewsLetterList();
    },[]);

    /**
     * Method to retrieve list of Newsletter from API
     */
    const getNewsLetterList =() =>{
        NewsLettterAPIService.getNewsLetterList()
            .then((response:any) => {
                setNewsLetterListDTO(response.data);
            })
            .catch((e:Error) => {
                console.error(e);
            });
    }

    /**
     * Handlers
     */

    const handleDelete = (key: number) => {
        NewsLettterAPIService.deleteNewsLetter(key)
            .then((response:any) => {
                getNewsLetterList();
            })
            .catch((e:Error) => {
                console.error(e);
            });
    };

    const handleEdit = (key: number) => {
               
        const current = NewsLetterListDTO.find((x:NewsLetter) => x.id === key);        
        setCurrentNewsLetter(current);
        NewsLettterAPIService.getScheduleByNewsletter(current?.id??0)
            .then((response:any) => {
                
                setScheduleDTO(response.data);
                
            })
            .catch((e:Error) => {
                console.error(e);
            });

        setNewNewsLetter(false);
        setDetailMode(1);


    };

    const handleReturnToList = () =>{
        setDetailMode(0);
    }

    const handleToSave =(objToSave:NewsLetter)=>{
        if(NewNewsLetter){
            NewsLettterAPIService.postNewsLetter(objToSave)
            .then((response:any) => {
                getNewsLetterList();
            })
            .catch((e:Error) => {
                console.error(e);
            });

        }else{
            NewsLettterAPIService.updateNewsLetter(objToSave.id,objToSave)
            .then((response:any) => {
                getNewsLetterList();
            })
            .catch((e:Error) => {
                console.error(e);
            });

        }

    }

    const handleAddToEmailList=(recipientList:Recipient[])=>{
        const current = CurrentNewsLetter;
        recipientList.forEach((element:Recipient) => {
            if(current?.recipients.findIndex((x:Recipient) => x.email === element.email) ==-1){
                current.recipients.push(element);
            }
        });

        
        if(current){
            NewsLettterAPIService.postSuscribeList(current)
            .then((response:any) => {
                getNewsLetterList();
            })
            .catch((e:Error) => {
                console.error(e);
            });
        }
    }

    const handleCreateNL = () => {
        setCurrentNewsLetter(undefined);
        setNewNewsLetter(true);
        setDetailMode(1);
    }

    const handleDeleteEmail =(id:number)  => {
        const current:NewsLetter = {id:CurrentNewsLetter?.id ?? 0,
            name:"",
            description:"",
            customer:"",
            attachment:"",
            template:"",
            recipients:[{id:id,name:"",email:""}]
        };
                
        if(current)
        {
            NewsLettterAPIService.putUnsubscribe(current.id ?? 0, current as NewsLetter)
                .then((response:any) => {
                getNewsLetterList();
                const currentx = NewsLetterListDTO.find((x:NewsLetter) => x.id === current.id);        
                setCurrentNewsLetter(currentx);
            })
            .catch((e:Error) => {
                console.error(e);
            });
        }       
    }

    const handleScheduleSubmit = (ScheduleDTOx:Schedule) =>{
        console.log(ScheduleDTOx);
        if(!ScheduleDTO){
            ScheduleDTOx.newsLetterId = CurrentNewsLetter?.id??0;
            NewsLettterAPIService.postSchedule(ScheduleDTOx)
            .then((response:any) => {
                setScheduleDTO(response.data);
                
            })
            .catch((e:Error) => {
                console.error(e);
            });

        }else{

            NewsLettterAPIService.putSchedule(ScheduleDTOx.scheduleId,ScheduleDTOx)
            .then((response:any) => {
                setScheduleDTO(response.data);
            })
            .catch((e:Error) => {
                console.error(e);
            });
        }
    }

    /**
     * Main Return
     */
    return(
        <>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Flex gap="small" wrap="wrap">
                    
                    <Button 
                        onClick={handleCreateNL}
                        type="primary" 
                        shape="round" 
                        icon={<FileAddOutlined />} 
                        size="large" />
                    
                </Flex>
                
                {DetailMode?
                <NewsLetterForm
                    NewsLetterDTO={CurrentNewsLetter}
                    handleReturnToList={handleReturnToList}
                    handleToSave={handleToSave}
                    NewNewsLetter={NewNewsLetter}
                    handleAddToEmailList = {handleAddToEmailList}
                    handleDeleteEmail={handleDeleteEmail}
                    ScheduleDTO={ScheduleDTO}
                    handleScheduleSubmit={handleScheduleSubmit}
                ></NewsLetterForm>:
                <NewsLetterList
                    NewsLetterListDTO = {NewsLetterListDTO}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}                    
                ></NewsLetterList>}

               

               
            </Space>
        </>

    );
}
export default NewsLetterPage;