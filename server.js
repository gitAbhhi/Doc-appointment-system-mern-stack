const express=require('express')
const colors =require('colors')
const moragan=require('morgan')
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const path =require("path")

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app=express()

//middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(moragan('dev'))

//routes
app.use("/api/v1/user",require("./routes/userRoutes"));
app.use('/api/v1/admin',require('./routes/adminRoutes'))
app.use('/api/v1/doctor',require('./routes/doctorRoutes'))

// deploy purpose
app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*',function(req,res){
        res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//port 
const port =process.env.PORT || 8080
//listen port
app.listen(port,()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} MODE ON  PORT ${process.env.PORT}`.bgCyan.white)
})