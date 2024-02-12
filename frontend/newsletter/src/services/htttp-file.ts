import axios from "axios";

export default axios.create({
  baseURL: 'https://www.filestackapi.com/api/store/S3?key=AhFvrvtZjQHWp15rPmsQNz',
  headers: {
    "Content-type": "image/jpg",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  }  
});