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
import { FileInfo } from "../types/FileInfo";


/**
 * News Lettter List compornent Page This page manage the state data for the app
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
    const [CurrentFileObject, setCurrentFileObject] = useState<FileInfo>();
   



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

    /**
     * Calls the API for delete a newsletter object from backend
     * @param key prirmary Key for newsletter
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

    /**
     * Calls the api to update a newsletter record, Also shows the detail form to edit the newsletter
     * @param key Primary keay for newsletter record
     */
    const handleEdit = async (key: number) => {
               
        const  current = await NewsLetterListDTO.find((x:NewsLetter) => x.id === key);        
        setCurrentNewsLetter(current);
       
        
        NewsLettterAPIService.getScheduleByNewsletter(current?.id??0)
            .then((response:any) => {
                //Set the updated state
               setScheduleDTO(response.data);
                
            })
            .catch((e:Error) => {
                console.error(e);
            });
        
        try{
            console.log(current);
            
                setCurrentFileObject(JSON.parse(current?.attachment??"{}"));
            
        }
        catch(e){
            console.log(e);
        };
        setNewNewsLetter(false);
        setDetailMode(1);

    };

   /**
    * Calls the API to create a new Newsletter in the backend database
    * @param objToSave DataObject to save
    */
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
    /**
     * Calls the Api to Save a list of emails to a existent newsletter
     * @param recipientList Recipient List to Save
     */
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

    const handleReturnToList = () =>{
        setDetailMode(0);
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

    function FileUploadDoneHandler(FileObjectDTO: FileInfo): void {
        setCurrentFileObject(FileObjectDTO);
    }

    function SendNewsLetterNOWHandler(id: number): void {
        NewsLettterAPIService.sendNewsLetter(id)
            .then((response:any) => {
               
            })
        .catch((e:Error) => {
            console.error(e);
        });
    }

    /**
     * Main Return
     */
    return(
        <>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
               
                
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
                    CurrentFileObject = {CurrentFileObject}
                    FileUploadDoneHandler={FileUploadDoneHandler}
                    SendNewsLetterNOWHandler={SendNewsLetterNOWHandler}
                ></NewsLetterForm>:
                <div>
                <Flex gap="small" wrap="wrap">
                  
                    <Button 
                        onClick={handleCreateNL}
                        type="primary" 
                        shape="round" 
                        icon={<FileAddOutlined />} 
                        
                        size="large" />
                </Flex>
                <NewsLetterList
                    NewsLetterListDTO = {NewsLetterListDTO}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}                    
                ></NewsLetterList>
                </div>   
                }
               
            </Space>
        </>

    );
}
export default NewsLetterPage;