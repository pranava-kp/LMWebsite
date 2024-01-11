const mongoose=require('mongoose');
 const fileschema=new mongoose.Schema({

    name:{
      
        type:String,
    },
    description:
    {
        type:String,
    },
    url:{
        type:String,
    },  
    email:{
        type:String,
    },
    count:{
        type:Number,
        default:0
    }


 })
 module.exports=mongoose.model('file',fileschema);