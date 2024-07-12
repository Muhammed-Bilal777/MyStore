


import catchAsynError from "../middleware/catchAsynError.js"
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import ErrorHandler from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

 
dotenv.config({path:"backend/config/config.env"})
 
 


export const creatingUser = catchAsynError(async (req,res,next)=>{

   const {name,email,password}=req.body;

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);


   const user = await userModel.create({name,email,password: hashedPassword})
   const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });


   await user.save();

    res.status(201).json({token, message: 'User created successfully' });

})

export const userLogin = catchAsynError(async (req,res,next)=>{

  
    const {email,password}=req.body;
    const user = await userModel.findOne({email:email})
    

    if(!user){
       return next(new ErrorHandler("user not found", 404))
    }

    const isValid = await bcrypt.compare(password, user.password);
   
    if(!isValid){
       return next(new ErrorHandler("Invalid user email or password", 404))
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
    res.status(200).json({ token, message: 'Logged in successfully' , user : user.name });

})