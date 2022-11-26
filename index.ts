import express, { response } from "express";
import env from 'dotenv'
import { Client } from "pg";
import cors from "cors";


import pool from "./db"
import axios from "axios";

env.config();
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.get("/", async(req, res) => {
    const queryFrom = req.query.search_query;
    let {data} = await axios.get(`https://jsonplaceholder.typicode.com/todos`)
    console.log(data);
    
    return res.json({'dnabf':'adfj'});
})


async function getAll(value:any){
    const pp = await pool.query("select * from newcust where ")
    return pp;
}



app.listen(1200, () => {
    console.log("SERVER AT 1200");

})