import React from 'react'
import "../styles/LoginStyles.css"
import {Form,Input,message} from 'antd'
import { useDispatch } from 'react-redux'
import { showLoading,hideLoading } from '../redux/features/alertSlice'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    //form handler
    const onfinishHandler=async (values)=>{
        try {
            dispatch(showLoading());
            const res=await axios.post("/api/v1/user/login",values)
            window.location.reload();
            dispatch(hideLoading())
            if(res.data.success){
                localStorage.setItem("token",res.data.token)
                message.success("Login Successfully")
                navigate('/');
            }
            else{
                message.error(res.data.message)
            }
            
        } catch (error) {
            dispatch(hideLoading());
           console.log(error) 
           message.error("something went wrong");
        }
    }
  return (
    <>
    <div className="form-container  ">
        <Form layout="vertical" onFinish={onfinishHandler} className='Register-form p-4'>
            <h1 className='text-3xl text-center'>Login Form</h1>
            <Form.Item label="Email" name="email">
                <Input type="email" required />
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input type="password" required />
            </Form.Item>
            <div className='text-center'>
            <Link to="/register" className='m-4'>Not a user Register here</Link>
            <button className="btn btn-primary" type="submit">Login</button>
            </div>
        </Form>
    </div>
    </>
  )
}

export default Login
