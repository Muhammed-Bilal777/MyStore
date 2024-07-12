 

import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
import productRouter from "./routes/product.js"
import erroMiddleware from "./middleware/errors.js"
import authRoute from "../backend/routes/autjRoutes.js"
const app =express();


//handle uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down server due to   uncaught exception`);
    process.exit(1);
})

dotenv.config({path:"backend/config/config.env"})
 
connectDB();

app.use(express.json())
//importing all routes


 

app.use("/api/v1/",productRouter)
app.use("/api/v1",authRoute)
 
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