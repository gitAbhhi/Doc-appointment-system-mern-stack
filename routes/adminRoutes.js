const express =require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, changeUserStatusController } = require('../controllers/adminCtrl')

const router=express.Router()

//GET METHOD || USERS
router.get('/getAllUsers',authMiddleware,getAllUsersController)

//get mehtod || doctors
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController)

//post account status
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

//block user
router.post("/changeUserStatus",authMiddleware,changeUserStatusController)

module.exports=router