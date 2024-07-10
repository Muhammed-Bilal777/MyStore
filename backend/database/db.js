//mongodb+srv://mystore:MyNameIsBilal@cluster0.yryuvwf.mongodb.net/mystore

import mongoose from "mongoose";

export const connectDB = ()=>{
  try {
    mongoose.connect(process.env.MONGO_URI).then((con)=>{
        console.log(`MongoDB Connected `);
    }) 
  } catch (error) {
    console.log(error);
  }
}