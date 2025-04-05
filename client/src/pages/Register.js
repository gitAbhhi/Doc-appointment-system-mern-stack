import React from 'react'
import "../styles/RegisterStyles.css"
import {Form,Input,message} from 'antd'
import axios from 'axios'
import { Link ,useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showLoading,hideLoading } from '../redux/features/alertSlice'
const Register = () => {
 
    const navigate=useNavigate()
    const dispatch=useDispatch()
    // form handler
    const onfinishHandler= async (values)=>{
        try {
            dispatch(showLoading());
            const res=await axios.post('/api/v1/user/register',values)
            dispatch(hideLoading())
            if(res.data.success){
                message.success("Register Successfully")
                navigate('/login')
            }
            else{
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error("Something went wrong")
        }
    }
  return (
    <>
    <div className="form-container">
        <Form layout="vertical" onFinish={onfinishHandler} className='Register-form p-4'>
            <h1 className='text-3xl text-center'>Register Form</h1>
            <Form.Item label="Name" name="name">
                <Input type="text" required />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input type="email" required />
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input type="password" required />
            </Form.Item>
            <div className='text-center'>
            <Link to="/login" className='m-4'>Already user login here</Link>
            <button className="btn btn-primary" type="submit">Register</button>
            </div>
        </Form>
    </div>
    </>
  )
}

export default Register
