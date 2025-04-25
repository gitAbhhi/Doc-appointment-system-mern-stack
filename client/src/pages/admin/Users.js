import { useEffect ,useState} from 'react'
import React from 'react'
import Layout from './../../components/Layout'
import axios from 'axios'
import {  message, Table } from 'antd'
const Users = () => {
  const [users,setUsers]=useState([])

  //getUsers
  const getUsers=async()=>{
    try {
      const res=await axios.get('/api/v1/admin/getAllUsers',{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
      },
    })
      if(res.data.success){
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

//handle user status block or not
const handleuserStatus=async(record,status)=>{
  try {
  console.log("user ",record);
  console.log("status ",status )
  const res=await axios.post("/api/v1/admin/changeUserStatus",{
    UserId:record._id,status:status,
  },{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })
  console.log("res.data ",res.data)
  if(res.data.success){
    console.log("Popup should show now");
    message.success(res.data.message)
    setUsers(prevUser=>
      prevUser.map(user=>
        user._id===res.data.user._id?res.data.user:user
      )
    )
  }else{
    message.error("Failed to update user status")
  }
} catch (error) {
  console.log(error)
}
}


  useEffect(()=>{
    getUsers()
  },[])

  //antd table col
  const columns=[
    {
      title:'Name',
      dataIndex:'name',
    },
    {
      title:'Email',
      dataIndex:'email',
    },
    {
      title:'Doctor',
      dataIndex:'isDoctor',
      render:(text,record)=><span>{record.isDoctor?"yes":"NO"}</span>,
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(text,record)=>(
        <div >
          {
            record.block===false ?(
          <button className='btn btn-danger w-[100px]' onClick={()=>handleuserStatus(record,true)}>Block</button>

            ):(
          <button className='btn btn-success w-[100px]' onClick={()=>handleuserStatus(record,false)}>Unblock</button>

            )
          }
        </div>
      )
    }
  ]
  return (
    <Layout>
        <h1 className='text-center m-2'>user list</h1>
        <Table columns={columns} dataSource={users}/>
    </Layout>
  )
}

export default Users
