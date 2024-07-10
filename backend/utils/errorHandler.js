
class ErrorHandler extends Error{
    
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode;
    
        //capturing error stack
        Error.captureStackTrace(this,this.constructor)
    }
   
}

export default ErrorHandler;