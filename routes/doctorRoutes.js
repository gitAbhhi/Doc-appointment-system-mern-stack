const express=require('express')
const authMiddleware=require('../middlewares/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorCtrl')
const router=express.Router()
const upload=require("../config/multerconfig")

//post single doc info
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware,upload.single("profileImage"),updateProfileController);

//post get single doc info
router.post("/getDoctorById", authMiddleware,getDoctorByIdController);

//get appointment
router.get('/doctor-appointments',authMiddleware,doctorAppointmentsController)

//POST UPDATE status
router.post("/update-status", authMiddleware,updateStatusController);

module.exports=router 