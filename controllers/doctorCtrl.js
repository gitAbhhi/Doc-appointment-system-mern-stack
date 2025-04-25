const appointmentModel = require("../models/appointmentModels");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");


const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "doctor data fetch success",
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "error in fetching doctor detailss"
        })

    }
}
// update doc profile
const updateProfileController = async (req, res) => {
    try {
        const file = req.file;
        const { userId, ...restofbody } = req.body;

        if (file) {
            const base64Image = file.buffer.toString("base64")
            const mimeType = file.mimteype;
            const fullImage = `data:${mimeType};base64,${base64Image}`;
            restofbody.profileImage = fullImage;
        }

        console.log("req.body ", req.body.userId)
        const doctor = await doctorModel.findOneAndUpdate({ userId: userId },
            restofbody,
            {
                new: true
            }
        )
        console.log("doctor", doctor)
        res.status(201).send({
            success: true,
            message: "Doctor profile updated",
            data: doctor,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Doctor profile update issue",
            error,
        })
    }
}
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: "single doc info fetched",
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in Single doctor info",
            error
        })
    }
}
// doctor Appointments Controller
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        const appointments = await appointmentModel.find({
            doctorId: doctor._id,
        })
        res.status(200).send({
            success: true,
            message: "doctor appointment fetch successfully",
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "error in doc appointment"
        })
    }
}

const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status, UserId } = req.body;
        // const status=req.body.appointment.status;
        console.log(req.body)
        console.log("userid form doc  ctrl", UserId)
        const appointments = await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            { status }
        );
        const user = await userModel.findOne({ _id: UserId });
        console.log("user form doc ctrl ", user)
        const notification = user.notification
        notification.push({
            type: "status-updated",
            message: `your appointment has been updated ${status}`,
            onClickPath: "/appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated",
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'error in update status'
        })
    }
}

const updateSlotCtrl = async (req, res) => {
    try {
        const { date, times, doctorId } = req.body;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
        return res.status(404).send("Doctor not found");
    }

    const existingSlot = doctor.availableSlots.find(s => s.date === date);
    if (existingSlot) {
        existingSlot.times = times;
    }else{
        doctor.availableSlots.push({date,times})
    }

    await doctor.save();
    res.status(200).send({
        success:true,
        message:"slots updated"
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in slot updation"
        })
    }
    
}

const getbookedSlotCtrl=async(req,res)=>{
    try {
        const {date}=req.body
        const appointments = await appointmentModel.find({
            doctorId: req.body.doctorId,date
        })

        res.status(200).send({
            success: true,
            message: "doctor appointment fetch successfully",
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "error in get booked appointment"
        })
    }
}


// const getBookedSlotCtrl=async(req,res)=>{
// try {
//     const {doctorId,date}=req.body;
// const appointments=await appointmentModel.find({
//     doctorId,date
// })
// const bookedSlots=appointments.map(appt=>appt.time)
// res.status(200).send({
//     success:true,
//     message:"get booked slot successfully",
//     bookedSlots
// })
    
// } catch (error) {
//     console.log(error)
//     res.status(500).send({
//         success:false,
//         error,
//         message:"error in geting booking slot"
//     })
// }
// }



module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController,
    updateSlotCtrl,
    getbookedSlotCtrl
};