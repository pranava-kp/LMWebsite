const signup=require("../model/user")
const bcrypt=require("bcrypt")
exports.signup= async(req,res)=>{
    try{
        //fetch the data from the req body;
        const{firstName,lastName,email,password,confirmPassword}=req.body;
        //check user is already exist or not
        const response=await signup.findOne({email:email});
        if(!response){
            //validate the password and cnf password
            if(password!==confirmPassword)
            {
                return res.status(400).json({message:"password and confirm password is not same"})
            }
            let hashPassword;
            try{
                hashPassword=await bcrypt.hash(password,10)
            }
            catch(error)
            {
                return res.status(500).json({message:"problem in hashing the password",error:error})
            }
            //create the entry in the databse
            const data= new signup({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:hashPassword,
                
            })
            const result=await data.save();
            return res.status(200).json({message:"user is created", success:true})
        }
        else{
            return res.status(400).json({message:"user is already exist"})
        }
    }
    catch(error){
        return res.status(500).json({message:"internal server error",error:error})
    }
}