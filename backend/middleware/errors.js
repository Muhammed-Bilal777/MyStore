import ErrorHandler from "../utils/errorHandler.js";

export default (err,req,res,next)=>{
    let error ={
        statusCode : err?.statusCode || 500,
        message : err?.message || "internal server error",
    };


    //handle invalid mongoose id error

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid  ${err.path} : ${err.value}`
        error = new ErrorHandler(message,404)
    }

    //validaton error for mongoose
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((value) => value.message)
        error = new ErrorHandler(message,404)
    }

    if(err.code === 11000){
        const message = `duplicate email , email is already registered`
        error = new ErrorHandler(message,404)
    }

   if(process.env.NODE_ENV === "DEVELOPMENT"){
    res.status(error.statusCode).json({
        message : error.message,
        error:err,
        stack:err?.stack
    })
   }
   if(process.env.NODE_ENV === "PRODUCTION"){
    res.status(error.statusCode).json({
        message : error.message,
    })
   }

   
    next();
};