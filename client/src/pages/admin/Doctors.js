import React from 'react'
import Layout from './../../components/Layout'
import axios  from 'axios'
import { useEffect ,useState} from 'react'
import { Table } from 'antd'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'

const Doctors = () => {
const [doctors,setDoctors]=useState([])
const dispatch=useDispatch()
  //get doctor
  const getDoctors=async()=>{
    try {
      const res=await axios.get('/api/v1/admin/getAllDoctors',{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
      },
    })
      if(res.data.success){
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error)
    }
  }
  //handleAccountStatus
  const handleAccountStatus=async(record,status)=>{
      try {
        const res=await axios.post(
          "/api/v1/admin/changeAccountStatus",
          {doctorId:record._id,userId:record.userId,status:status},
          {
            headers:{
              Authorization:`Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        if(res.data.success){
          message.success(res.data.message);
          // console.log("doctro status ",res.data)
          // setDoctors(prevdoctor=>{
          //   prevdoctor.map(doctor=>
          //     doctor._id===res.data.doctor._id?res.data.doctor:doctor
          //   )
          // })
          getDoctors()

        }
        
      } catch (error) {
        console.log(error)
        message.error("Something went wrong")
      }
  }
  useEffect(()=>{
    getDoctors()
  },[])

  const columns=[
    {
      title:'Name',
      dataIndex:'name',
      render:(text,record)=>(
        <span>{record.firstName}{record.lastName}</span>
      ),
    },
    {
      title:'Status',
      dataIndex:'status'
    },
    {
      title:'Phone',
      dataIndex:'phone'
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(text,record)=>(
        <div className='d-flex'>
          {record.status === "pending"?(<button className='btn btn-success w-[100px]' onClick={()=>handleAccountStatus(record,"approved")}>Approve</button>)
          :(<button className='btn btn-danger w-[100px]' onClick={()=>handleAccountStatus(record,"pending")} >Reject</button>)}
        </div>
      ),
    },
  ]
  return (
    <Layout>
      <h1 className='text-center m-3'>All Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default Doctors
