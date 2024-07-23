 

import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
import productRouter from "./routes/product.js"
import erroMiddleware from "./middleware/errors.js"
import authRoutes from "../backend/routes/authRoutes.js"
import  orderRoutes from "../backend/routes/order.js"
import cookieParser from 'cookie-parser';
import cors from "cors"
const app =express();


 
app.use(cors());
app.use(express.json())
app.use(cookieParser());
//importing all routes
//handle uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down server due to   uncaught exception`);
    process.exit(1);
})

dotenv.config({path:"backend/config/config.env"})
 
connectDB();




 

app.use("/api/v1/",productRouter)
app.use("/api/v1",authRoutes)
app.use("/api/v1",orderRoutes)
//handling error 
app.use(erroMiddleware)


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is up and running on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})


//handling unhandleRejection which comes from mongodb 
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})