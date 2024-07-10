 

import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
import productRouter from "./routes/product.js"
import erroMiddleware from "./middleware/errors.js"
const app =express();
dotenv.config({path:"backend/config/config.env"})


connectDB();

app.use(express.json())
//importing all routes


 

app.use("/api/v1/",productRouter)
 
//handling error 
app.use(erroMiddleware)
app.listen(process.env.PORT,()=>{
    console.log(`Server is up and running on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})