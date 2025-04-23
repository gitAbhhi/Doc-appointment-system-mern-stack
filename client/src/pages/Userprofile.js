import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import axios from 'axios'
import { setUser } from '../redux/features/userSlice';


const Userprofile = () => {
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [uploadimage, setUploadimage] = useState(null);


  const handleupdateimage = async (e) => {
    try {
      e.preventDefault();

      if (!uploadimage) {
        return message.error("Please select an image to upload.");
      }


      const formData = new FormData();
      formData.append("avatar", uploadimage); // must match multer field
      formData.append("userId", user._id);

      console.log("uploaded img ", formData)
      const res = await axios.post("/api/v1/user/updateProfileImage", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      })
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data))
      }
      else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      message.error("error in userprofile")
    }
  }
  return (
    <Layout>
      <h1 className="text-center">Profile</h1>
      {user &&
        (<div className='card m-2 p-2'>
          <img src={user?.profileImage} alt="img" className='w-[200px]' />
          <form onSubmit={handleupdateimage} encType="multipart/form-data">
            <input type="file" class="fileupload" name="avatar" onChange={(e) => {
              console.log("vlaue ", e)
              setUploadimage(e.target.files[0])
            }} />
            <button class="bg-blue-600 p-2 text-white rounded-md" type="submit" >Upload</button>
          </form>
          <h5>Id: </h5><p>{user._id}</p>
          <h5>Name: </h5><p>{user.name}</p>
          <h5>Email: </h5><p>{user.email}</p>
        </div>
        )
      }
    </Layout>
  )
}

export default Userprofile
