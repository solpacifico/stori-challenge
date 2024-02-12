import axios from "axios";

export default axios.create({
  baseURL: 'https://192.168.68.100:32772/api',
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  }
});