import React from 'react'
import Layout from '../components/Layout'
import { message, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/features/userSlice';

const NotificationPage = () => {
    const dispatch=useDispatch();
    const {user}=useSelector(state=>state.user)
    const navigate=useNavigate();

    //handle read notification
    const handleMarkAllRead=async()=>{
        try {
            dispatch(showLoading());
            const res=await axios.post("/api/v1/user/get-all-notification",{
                userId:user._id,
            },
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if(res.data.success){
                message.success(res.data.message);
               dispatch(setUser(res.data.data))
                
            }else{
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error)
            message.error("something went wrong");
        }
    }
    //delete notification
    const handleDeleteAllRead=async()=>{
        try {
            dispatch(showLoading());
            const res=await axios.post(
                "/api/v1/user/delete-all-notification",
                {
                    userId:user._id
                },
               { headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },}
            )
            dispatch(hideLoading())
            if(res.data.success){
                message.success(res.data.message);
                dispatch(setUser(res.data.data))
            }else{
                message.error(res.data.message);
            }
            
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong in Notifications");
        }
    }

    const items = [
        {
            key: '0',
            label: 'UnRead',
            children: (
                <>
                    <div className="d-flex justify-content-end" style={{ cursor: 'pointer' }}>
                        <h4 className="p-2 text-primary" onClick={handleMarkAllRead}>
                            Mark All Read
                        </h4>
                    </div>
                    {user?.notification.map((notificationMgs, index) => (
                        <div key={index} className="card p-2 m-2" style={{ cursor: 'pointer' }}>
                            <div
                                className="card-text"
                                onClick={() => navigate(notificationMgs.onClickPath)}
                            >
                                {notificationMgs.message}
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
        {
            key: '1',
            label: 'Read',
            children: (
                <>
                    <div className="d-flex justify-content-end cursor-pointer">
                        <h4 className="p-2 m-2 text-primary" onClick={handleDeleteAllRead}>
                            Delete All Read
                        </h4>
                    </div>
                    {user?.seennotification.map((notificationMgs, index) => (
                        <div key={index} className="card p-2 m-2" style={{ cursor: 'pointer' }}>
                            <div
                                className="card-text"
                                onClick={() => navigate(notificationMgs.onClickPath)}
                            >
                                {notificationMgs.message}
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
    ];
    
  return (
   <Layout>
    <h4 className='text-center text-2xl'>Notification page</h4>
    <Tabs items={items} />;
   </Layout>
  )
};

export default NotificationPage
