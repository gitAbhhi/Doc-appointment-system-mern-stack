const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is require"]
    },
    email:{
        type:String,
        require:[true,"email is require"]
    },
    password:{
        type:String,
        require:[true,"password is require"]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[]
    },
});

const userModel=mongoose.model("users",userSchema);

module.exports=userModel;
