import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice'
import { message } from 'antd';

const BookingPage = () => {
  const { user } = useSelector(state => state.user)
  const params = useParams()
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isAvailable, setIsAvailable] = useState()
  const dispatch = useDispatch()

  // login user data
  const getdoctordata = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        {
          doctorId: params.doctorId
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const days = ['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON'];
  const dates = [23, 24, 25, 26, 27, 28];
  const timeSlots = ['10:00 am', '10:30 am', '12:00 pm', '12:30 pm', '01:00 pm', '01:30 pm', '02:00 pm', '02:30 pm'];


  //booking function
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading())
      console.log(date,time)
      const res = await axios.post('/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          time: time,
          userInfo: user,
        }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }

    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }
  //check availability

  const handleAvailability = async (e) => {
    try {
      dispatch(showLoading())
      e.preventDefault()
      const res = await axios.post('/api/v1/user/booking-availability',
        { doctorId: params.doctorId,date,time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      dispatch(hideLoading())
      if (res.data.success) {
        setIsAvailable(true)
        message.success(res.data.message)
      } else {
        message.error(res.data.message)
      }

    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }
  useEffect(() => {
    getdoctordata();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3 className='text-center'>BookingPage</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr. {doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees :{doctors.feesPerCunsaltation}</h4>
            <h4>
              Timings :  {doctors.timings && moment(doctors.timings[0]).format("HH:mm")}-
              {doctors.timings && moment(doctors.timings[1]).format("HH:mm")}
        
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker aria-required={"true"} className='m-2' format="DD-MM-YYYY" onChange={(value) => {
             
                setDate(value)

              }} />
              <TimePicker aria-required={"true"} className='m-2' format="HH:mm" onChange={(value) => {
                console.log("value ",value)
               console.log("Formatted Time:", moment(value).format("HH:mm"));
           
                setTime(value)

              }} />
              <button className='btn btn-primary mt-2' onClick={(e)=>handleAvailability(e)}>check Availability</button>
              
              <button className='btn btn-dark mt-2' onClick={(e)=>handleBooking(e)}>Book Now</button>
            </div>
          </div>
        )}
      </div>
     
    </Layout>
  )
}

export default BookingPage
