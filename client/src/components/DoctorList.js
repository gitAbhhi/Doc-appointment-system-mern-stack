import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const DoctorList = ({doctor}) => {
    const navigate=useNavigate()
  return (
    <>
     <div  className="card m-3 shadow-md" 
     style={{cursor:'pointer'}}
     onClick={()=>navigate(`/doctor/book-appointment/${doctor._id}`)}>
        <div className="card-header ">
            Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
            <img src={doctor.userId.profileImage} alt="img" className='w-[220px] h-[240px] object-cover mb-3 rounded-md' />
            <p>
                <b>Specialization</b> {doctor.specialization}
            </p>
            <p>
                <b>Experience</b> {doctor.experience}
            </p>
            <p>
                <b>Fees Per Cunsaltation</b> {doctor.feesPerCunsaltation}
            </p>
            <p>
                <b>Timings</b>
                {moment(doctor.timings[0]).format("HH:mm")}-
                 {moment(doctor.timings[1]).format("HH:mm")}
                 {/* {doctor.timings[0]}-{doctor.timings[1]} */}
            </p>
        </div>
     </div>
    </>
  )
}

export default DoctorList
