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
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [bookedslot, setbookedslot] = useState([])
  const [isAvailable, setIsAvailable] = useState(false)
  const dispatch = useDispatch()
  
  const [doctors, setDoctors] = useState([]);
  // get doctor data
  const getDoctorData = async () => {
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

  //booking function
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading())
      console.log(date, time)
      const res = await axios.post('/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date,
          time,
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
    e.preventDefault()
    try {
      const res = await axios.post('/api/v1/user/booking-availability',
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      if (res.data.success) {
        setIsAvailable(true)
        message.success(res.data.message)
      } else {
        message.error(res.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  //get booked slot
  const getbookedSlot = async () => {
    try {
      const res = await axios.post("/api/v1/doctor/get-booked-appointment",
        {
          doctorId: params.doctorId,date
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      if (res.data.success) {
        setbookedslot(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsAvailable(false); // reset availability when user changes date or time
  }, [date, time]);

  useEffect(()=>{
    if(date){
      getbookedSlot()
    }
  },[date])

  useEffect(() => {
  
     getDoctorData()
    
  },[]);
  return (
    <Layout>
      <h3 className='text-center text-3xl'>BookingPage</h3>
      <div>

        <div className="container m-2 ">
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
                {!date && <p className='text-red ml-2 text-[14px]'>Please select a date first</p> }
                <TimePicker aria-required={"true"} className='m-2' disabled={!date}  minuteStep={60} showNow={false} format="HH" onChange={(value) => {
                  console.log("value ", value)
                  console.log("Formatted Time:", moment(value).format("HH"));
                  setTime(value)

                }} />
                <button className='btn btn-primary mt-2' disabled={!date || !time}  onClick={(e) => handleAvailability(e)}>check Availability</button>
                <button className='btn btn-dark mt-2' hidden={!isAvailable} onClick={(e) => handleBooking(e)}>Book Now</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <h1 className='text-center text-2xl '>booked slot</h1>
          <div className='flex'>
          {bookedslot && bookedslot.map((appointment,index)=>(

          <div key={index} className='card w-[200px] m-2 shadow-md p-2'><p>Booked</p>
          <p>Date : {moment(appointment.date).format("DD/MM/YYYY")}</p> 
          <p>Time :{moment(appointment.time).format("HH:mm")}</p></div>
          ))}
          </div>
        </div>
      </div>


    </Layout>
  )
}

export default BookingPage
