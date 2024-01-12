const User = require("../model/user")
const bcrypt = require("bcrypt")
exports.signup = async(req,res)=>{
    try{
        //fetch the data from the req body;
        const{firstName, lastName, email, password, confirmPassword}=req.body;
        //check user is already exist or not
        const response = await User.findOne({email:email});
        if(!response){
            //validate the password and cnf password
            if(password!==confirmPassword)
            {
                return res.status(400).json({message:"Password and Confirm Password does not match"})
            }
            let hashPassword;
            try{
                hashPassword = await bcrypt.hash(password,10)
            }
            catch(error)
            {
                return res.status(500).json({message:"Error while hashing the password",error:error})
            }
            //create the entry in the databse
            const data= new signup({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:hashPassword,
            })
            await data.save();
            return res.status(200).json({message:"User is created", success:true})
        }
        else{
            return res.status(400).json({message:"User already exist"})
        }
    }
    catch(error){
        return res.status(500).json({message:"Internal server error", error:error})
    }
}