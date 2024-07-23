


import catchAsynError from "../middleware/catchAsynError.js"
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import ErrorHandler from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

 
dotenv.config({path:"backend/config/config.env"})
 
 

//Registering user
export const creatingUser = catchAsynError(async (req,res,next)=>{

   const {name,email,password}=req.body;

   // const salt = await bcrypt.genSalt(10);
   // const hashedPassword = await bcrypt.hash(password, salt);


   const user = await userModel.create({name,email,password})
   sendToken(user,201,res)

   
   
    res.status(201).json({token, message: 'User created successfully' });

})


// logging user
export const userLogin = catchAsynError(async (req,res,next)=>{

  
    const {email,password}=req.body;
    if(!email || !password){
      return next(new ErrorHandler("Please provide email and password", 404))
   }
    const user = await userModel.findOne({email:email}).select("+password")
    

    if(!user){
       return next(new ErrorHandler("User not found", 404))
    }
 

    //checking password
    const isValid = await user.comparePassword(password)
   
    if(!isValid){
       return next(new ErrorHandler("Invalid email or password", 404))
    }
  
    sendToken(user,200,res);

     

})


//logging out current user

export const userLogout = catchAsynError(async (req,res,next)=>{



      
    res.cookie("token", null ,{
      expires: new Date(Date.now()),
      httpOnly:true,
      
    })
     
   

   res.status(200).json({
      message : "Logged out successfully"
   })
   next()
 
})


// forgot password
export const forgotPassword = catchAsynError(async (req,res,next)=>{

  
   const {email}=req.body;
   const user = await userModel.findOne({email:email})

   if(!user){
     return next(new ErrorHandler("email is not valid", 404))
  }
    
   //get reset password

   const resetToken =  user.getResetPasswordToken();
   await user.save();


   //create reset URL

   const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`

    

    const message = getResetPasswordTemplate(user?.name,resetUrl);

    try {

      await sendEmail({
         email: user?.email,
         subject: "Password reset token",
         message
      })
      
      return res.status(200).json({
         message :`Email sent to: ${user?.email}`
      })
    } catch (error) {
      user.resetPasswordToken=undefined
      user.resetPasswordExpire=undefined
      await user.save();
      return next(new ErrorHandler(error?.message, 404))


    }
    
   

    

})




// reset password
export const resetPassword = catchAsynError(async (req,res,next)=>{
                  //get user based on token
               const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
      const user = await userModel.findOne({
         resetPasswordToken,
         resetPasswordExpire:{$gt:Date.now()}
      })
      if(!user){
         return next(new ErrorHandler("password reset token is invalid or has been expired", 404))
      }

      if(req.body.password !== req.body.confimPassword){
         return next(new ErrorHandler("password and confirm password doesn't match", 404))
      }

      //set new password

      user.password=req.body.password;

      //resetting both values
      user.resetPasswordToken=undefined
      user.resetPasswordExpire=undefined
      await user.save();

      sendToken(user,200,res)
      
})


// get current user details


export const getUserDetails =catchAsynError(async (req,res,next)=>{
   const user = await userModel.findById(req?.user?._id);

   res.status(200).json({
     user,
   });
})



// update current user password
export const updatePassword =catchAsynError(async (req,res,next)=>{
   const user = await userModel.findById(req.user._id).select("+password");

   //check previous user passwor

   const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

   if(!isPasswordMatch){
      return next(new ErrorHandler("old password is incorrect", 400))
   }

   user.password=req.body.password;
   user.save();

   res.status(200).json({
      success:true,
   })



    
})


// update  user profile
export const updateProfile =catchAsynError(async (req,res,next)=>{
     
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    }

    const user = await userModel.findByIdAndUpdate(req.user._id, newUserData,{new : true})


   res.status(200).json({
      user
   })



    
})

// Get all users admin only
export const allUsers =catchAsynError(async (req,res,next)=>{

   const users = await userModel.find();
   let numberOfUsers=users.length

   res.status(200).json({
      numberOfUsers,
      users
   })
})

// Get   user details by admin only admin
export const userDetails =catchAsynError(async (req,res,next)=>{

   const user = await userModel.findById(req.params.id);

   if(!user){
      return next(new AppError('No user found with that ID',404))
   }

   res.status(200).json({
      
      user,
   })
})
     


// update  user Details only by admin
export const updateUserDetails =catchAsynError(async (req,res,next)=>{
     
   const newUserData = {
     name: req.body.name,
     email: req.body.email,
     role : req.body.role
   };

   const user = await userModel.findByIdAndUpdate(req.params.id, newUserData,{new : true})


  res.status(200,).json({
     user
  })



   
})


// delete user by  admin  
export const deleteUser =catchAsynError(async (req,res,next)=>{

   const user = await userModel.findById(req.params.id);

   if(!user){
      return next(new AppError('No user found with that ID',404))
   }

   await user.deleteOne();

   //TODO remove user avatar from cloudinary

   res.status(200).json({
      
     success:true
   })
})
   


