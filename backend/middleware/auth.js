

//check if user authenticated or not

import ErrorHandler from "../utils/errorHandler.js";
import catchAsynError from "./catchAsynError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"


export const isAuthenticatedUser = catchAsynError(async (req,res,next)=>{
    console.log(req.cookies);
    const { token } = req.cookies;
//   console.log(token);
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
    
})


//authorize user Roles

export const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource` , 401))
        }
        next();
    }
}