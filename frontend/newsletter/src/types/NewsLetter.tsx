import { Recipient } from "./Recipient";

export interface NewsLetter{
    id:number;
    name:string;
    description:string;
    template:string;
    attachment:string;
    customer:string;
    recipients:Recipient[];
}