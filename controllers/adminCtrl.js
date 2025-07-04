const doctorModel=require('../models/doctorModel')
const userModel=require('../models/userModels')

const getAllUsersController=async(req,res)=>{
    try {
        const users=await userModel.find({})
        res.status(200).send({
            success:true,
            message:"users data list",
            data:users,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while fetching users",
            error,
        })
    }
}


const getAllDoctorsController=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({})
        res.status(200).send({
            success:true,
            message:'Doctors Data List',
            data:doctors,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while getting doctors data',
            error
        })
    }
}

const changeAccountStatusController=async(req,res)=>{
    try {
        const {doctorId,status}=req.body;
        const doctor=await doctorModel.findByIdAndUpdate(doctorId,{status})
        const user=await userModel.findOne({_id:doctor.userId})
        const notification=user.notification;
        notification.push({
            type:"doctor-account-request-updated",
            message:`Your Doctor Account Request Has ${status}`,
            onClickPath:"/notification",
        })
        user.isDoctor =status ==="approved"?true:false;
        await user.save();
        res.status(201).send({
            success:true,
            message:"Account Status Updated",
            doctor,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Account Status",
            error
        })
    }
}

// user status block or not ctrl
const changeUserStatusController=async(req,res)=>{
try {
    const {UserId,status}=req.body
    const user=await userModel.findByIdAndUpdate(UserId,
        {block:status},{new:true}
    )
    res.status(200).send({
        success:true,
        message:`User ${status?"block":"Unblock"} successfully`,
        user
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:"error in user Status"
    })
}
}

module.exports={getAllDoctorsController,
    getAllUsersController,
    changeAccountStatusController,
    changeUserStatusController}