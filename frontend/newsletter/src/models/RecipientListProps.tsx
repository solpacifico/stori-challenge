
import { Recipient } from "../types/Recipient";

export interface RecipientListProps{

    RecipientList?:Recipient[];
    handleAddToEmailList?:(emailList:Recipient[])=> void;
    handleDeleteEmail?:(id:number)=> void;

}
