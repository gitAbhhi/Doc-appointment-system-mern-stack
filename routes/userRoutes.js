const express =require('express')
const { loginController, registerController, authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController, updateProfileImageController} = require('../controllers/userCtrl')
const authMiddleware = require('../middlewares/authMiddleware')
const upload=require("../config/multerconfig")

//router object
const router=express.Router()

//routes
//login||post
router.post('/login',loginController)

//register||post
router.post('/register',registerController)

//Auth||post
router.post('/getUserData',authMiddleware,authController)

//Apply doctor||post
router.post('/apply-doctor',authMiddleware,upload.single("profileImage"),applyDoctorController)
module.exports=router;

//Notification doctor||post
router.post('/get-all-notification',authMiddleware,getAllNotificationController)
module.exports=router;

//Notification doctor||post
router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController)

//get all doc
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController)

//book appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController)

//booking availability
router.post('/booking-availability',authMiddleware,bookingAvailabilityController)

//user Appintment
router.get('/user-appointments',authMiddleware,userAppointmentsController)

//update Profile Image
router.post("/updateProfileImage",authMiddleware,upload.single("avatar"),updateProfileImageController)
module.exports=router;