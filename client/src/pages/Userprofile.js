import React from 'react'
import Layout from '../components/Layout'
import { useSelector } from 'react-redux'

const Userprofile = () => {
  const {user}=useSelector(state=>state.user)
  console.log(user.name)
  return (
    <Layout>
        <h1 className="text-center">Profile</h1>
      {user &&
      (<div className='card m-2 p-2'>

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
