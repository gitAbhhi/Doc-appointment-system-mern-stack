const { genSalt } = require("bcryptjs");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel")
const moment=require('moment');
const appointmentModel=require('../models/appointmentModels')

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: "User Already Exist", success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt / genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Register Sucessfully", success: true });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false, message: `register constroller ${error.message}`,
        })
    }
}

// login handler 

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'user not found', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false })

        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: 'Login Success', success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` })
    }
}
//auth handler
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'user not found',
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "auth error",
            success: false,
            error
        })
    }
};

//apply doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctor-request',
            message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath:'/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id,{notification})
       res.status(201).send({
        success: true,
        message: 'Doctor account applied Successfully'
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message: 'Error while applying for doctor',
    })
}
}
//notification ctrl
const getAllNotificationController=async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body.userId})
        const seennotification=user.seennotification
        const notification=user.notification
        seennotification.push(...notification)
        user.notification=[]
        user.seennotification=notification
        const updatedUser=await user.save()
        res.status(200).send({
            success:true,
            message:'all notification marked as read',
            data:updatedUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error,
        })
    }
}

//delete notification
const deleteAllNotificationController=async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body.userId})
        user.notification=[];
        user.seennotification=[];
        const updatedUser=await user.save();
        updatedUser.password=undefined;
        res.status(200).send({
            success:true,
            message:"Notifications Delete Successfully",
            data:updatedUser,
        })        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"unable to delete all notifications",
            error,
        })
    }
}

const getAllDoctorsController=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({status:"approved"})
        res.status(200).send({
            success:true,
            message:"doctors lists fetched successfully",
            data:doctors,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error while fetching doctor",
        })
    }
}
//book appointment
const bookAppointmentController=async(req,res)=>{
    try {
        req.body.date=moment(req.body.date,'DD-MM-YYYY').toISOString()
        req.body.time=moment(req.body.time,'HH:mm').toISOString()
        req.body.status="pending"
        const newAppointment=new appointmentModel(req.body)
        await newAppointment.save()
        const user=await userModel.findOne({_id:req.body.doctorInfo.userId})
        user.notification.push({
            type:"New-appointment-request",
            message:`A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath:'/user/appointments',
        });
        await user.save()
        res.status(200).send({
            success:true,
            message:"Appointment Book Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while booking appointment'
        })
    }
}

//booking availability ctrl
const bookingAvailabilityController=async(req,res)=>{
try {
    const date=moment(req.body.date,"DD-MM-YYYY").toISOString()
    const fromTime=moment(req.body.time,"HH:mm")
    .subtract(1,"hours")
    .toISOString()
    const toTime=moment(req.body.time,"HH:mm")
    .add(1,"hours")
    .toISOString()
    const doctorId=req.body.doctorId;
    const appointment=await appointmentModel.find({
        doctorId,
        date,
        time:{
            $gte:fromTime,
            $lte:toTime,
        },
    });
    if(appointment.length>0){
        return res.status(200).send({
            message:"Appointment not available at this time",
            success:true,
        })
    }else{
        return res.status(200).send({
            success:true,
            message:"Appointment available",
        })
    }
    
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:"Error In Booking"
    })
}
}

//user appointment ctrl
const userAppointmentsController=async(req,res)=>{
    try {
        const {appointmentId,status}=req.body
        const appointments=await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {status}
        )
        const user=await userModel.findOne({_id:appointmentId.userId})
        user.notification.push({
            type:"status-updated",
            message:`Your Appointment has been updated ${status}`,
            onClickPath:'/doctor-appointments',
        });
        await user.save()
        res.status(200).send({
            success:true,
            message:"Appointment status updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in user appointment"
        })
    }

}

module.exports = { 
    loginController, 
    registerController,
     authController, 
     applyDoctorController,
     getAllNotificationController,
     deleteAllNotificationController,
     getAllDoctorsController ,
     bookAppointmentController,
     bookingAvailabilityController,
     userAppointmentsController}