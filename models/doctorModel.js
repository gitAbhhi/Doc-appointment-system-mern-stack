const mongoose=require('mongoose')

const doctorSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true 
    },
    firstName:{
        type:String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'last name is required']
    },
    phone:{
        type:String,
        required:[true,'phone no is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'address is required']
    },
    specialization:{
        type:String,
        required:[true,'specialization is required']
    },
    experience:{
        type:String,
        required:[true,'experience is required']
    },
    feesPerCunsaltation:{
        type:Number,
        required:[true,'fees is required']
    },
    status:{
        type:String,
        default:'pending'
    },
    timings:{
        type:[String],
        required:[true,'work timing is required']
    },
    userInfo:{
        type:Object,
        required:true
    },

},{timestamps:true})

const doctorModel=mongoose.model('doctors',doctorSchema)
module.exports=doctorModel