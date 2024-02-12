import { Recipient } from "../types/Recipient";

function validateEmail(email:any) {
    // Regular expression for email validation
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

function BuildEmailJSON(emailList:any) {
    const emailObject:{ email:string , isValid:boolean }[] = [];

    emailList.forEach((email:any) => {
        const isValid = validateEmail(email);
        emailObject.push({ email:email, isValid:isValid });
    });

    return emailObject;
}

export function BuildEmailList(emailText:string){
    const list =  String(emailText).split(/\r?\n/).filter(Boolean);
    return BuildEmailJSON(list);
}