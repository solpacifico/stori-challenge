import { config } from "process";
import  { NewsLetter }  from "../types/NewsLetter";
import  { Recipient }  from "../types/Recipient";
import httpFile from './htttp-file';

const UploadFile = (data:any,config:any) =>{
    return httpFile.post("", data,config);
}



const FileAPIService ={
    UploadFile,
    

};

export default FileAPIService;