const fileschema=require('../model/fileupload');

const coludinary=require('cloudinary').v2;
exports. Localfileupload=async(req,res)=>{
    try{
        //fetch the file
        const file=req.files.file;
        //creating the server path
        let path=__dirname+'/files/'+ Date.now()+`.${file.name.split('.')[1]}`;

        //move file to the server
        file.mv(path,(err)=>{
            console.log(err);
        })

        //sending the response to the user
        return res.status(200).json({
            message:"file uploaded successfully",
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Internal server error",
        })
    }
}
async function cloudinaryconnect(file,foldername)
{
    const options={foldername}
   return  coludinary.uploader.upload(file.tempFilePath,options);
}
function iscorrect(filetype,filesupport)
{
    return filesupport.includes(filetype);
}
exports.imageupload=async(req,res)=>{

    try{
        //fetch the image data from the request body
        const file=req.files.Imagefile;
        const{name,description,email}=req.body;
        //validate the imagename
        let filetype=file.name.split('.')[1];
        console.log(filetype)
        const filesupport=['jpg','jpeg','png'];
        
        if(!iscorrect(filetype,filesupport))
        {
             return res.status(400).json({
                message:"file type not supported"
             })
        }
        //upload the file to cloudinary
        const response=await cloudinaryconnect(file,'anubhav');
        console.log("response print");
        console.log(response);
        //save the file data to the database
        const filedata=new fileschema({
            name:name,
            description:description,
            email:email,
            url:response.secure_url
        })
        const databaseresponse=await filedata.save();
        //send the response to the user
        return res.status(200).json({
            message:"file uploaded successfully",
            success:true,
            data:databaseresponse,
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            message:"Internal server error",
            error:err,

        })
    }
}

exports.getallfiles=async(req,res)=>{

    try{
        const allfiles=await fileschema.find({})

        return res.status(200).json({
            message:"All files",
            success: true,
            data:allfiles,
        })
    }
    catch(err)
    {
        return res.status(500).json({
            message:"Internal server error",
            error:err,
        })
    }
}
exports.countincrease=async(req,res)=>{

    try{
            //fetch the details
            const{id}= req.body;
            console.log(id);
            const response=await fileschema.updateOne({_id:id},{$inc:{count:1}});
            console.log(response);

           
            return res.status(200).json({
                message:"count updated sucessffuly",
                success:true,
                data:response
            })

    
    }
    catch(err)
    {
        return res.status(500).json({
            message:"internal server problem",
            error:err
        })
    }
}