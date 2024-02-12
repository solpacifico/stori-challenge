import  { NewsLetter }  from "../types/NewsLetter";



export interface NewsLetterListProps{

    NewsLetterListDTO:NewsLetter[];

    handleDelete?:(key:number)=> void;
    handleEdit?:(key:number)=> void;
    


}
