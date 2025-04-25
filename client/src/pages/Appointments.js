import React ,{useEffect, useState }from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import moment from 'moment';
import { message, Table } from 'antd';

const Appointments = () => {
    const [appointments,setAppointments]=useState([]);
    const getAppointments=async()=>{
        try {
            const res=await axios.get("/api/v1/user/user-appointments",
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`,
                    },
                })
                if(res.data.success){
                    setAppointments(res.data.data)
                }
            
        } catch (error) {
            console.log(error)
        }
    }


    //delete appointment
    const deleteAppointment=async(record)=>{
try {
    const res=await axios.post("/api/v1/user/delete-appointment",
        {
            appointmentId:record._id,
        },
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }
    )
    if(res.data.success){
        message.success(res.data.message)
        setAppointments((prevAppointments)=>
        prevAppointments.filter((appointment)=>
        appointment._id!==record._id))
    }
    else{
        message.error(res.data.message)
    }
} catch (error) {
    console.log(error)
}
    }

    useEffect(()=>{
        getAppointments()
    },[])
    const columns=[
        {
            title:"Doctor's Name",
            dataIndex:'name',
            render:(text,record)=>(
                <span>
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                </span>
            )
        },
        {
            title:"Doctor's Phone No",
            dataIndex:'phone',
            render:(text,record)=>(
                <span>
                    {record.doctorInfo.phone}
                </span>
            )
        },
        {
            title:'Date & Time',
            dataIndex:'date',
            render:(text,record)=>(
                <span>
                    {moment(record.date).format('DD/MM/YYYY')} &nbsp;
                    {moment(record.time).format('HH-mm')}
                </span>
            )
        },
        {
            title:'Status',
            dataIndex:'status',
        },
        {
            title:"Clear",
            render:(text,record)=>{
                return(
                    <button onClick={()=>deleteAppointment(record)}> <i className="fa-solid fa-x" ></i></button>
                )
            }

        }
    ]
  return (
    <Layout>
      <h1 className='text-center'>Appointments list</h1>
      <Table columns={columns} rowKey="_id" dataSource={appointments} />
    </Layout>
  )
}

export default Appointments
