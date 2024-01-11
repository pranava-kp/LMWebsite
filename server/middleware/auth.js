const jwt = require('jsonwebtoken');
require("dotenv").config();    
exports.auth = async (req, res,next) => {

    //fetch the token from the body;
    const token = req.body.token;
    console.log(token);
    if (!token) {
        return res.status(400).json({ message: "token is missing" })
    }
    try {
        const response = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(response);
        
        req.user=response;
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error })
    }
} 
exports.dashboard=async(req,res)=>{ 
    res.status(200).json({message:"welcome to dashboard"})
}

