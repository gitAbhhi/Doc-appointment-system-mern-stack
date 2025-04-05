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
        const doctor = await doctorModel.findByIdAndUpdate({ userId: req.body.userId },
            req.body
        )
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
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            { status }
        );
        const user = await userModel.findOne({ id: appointments.userId });
        const notification=user.notification
        notification.push({
            type: "status-updated",
            message: `your appointment has been updated ${status}`,
            onCLickPath: "/doctor-appointments",
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

module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController
};