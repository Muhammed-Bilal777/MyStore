// Create token and save in the cookie



export default (user, statusCode, res) => {

  dotenv.config({path:"backend/config/config.env"})
    // Create JWT Token
    const token = user.getJWToken();
     

    // Options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      token,
    });
  };