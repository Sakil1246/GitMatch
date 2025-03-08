import React, { useEffect } from 'react'
import Navbar from "./Navbar"
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { BasicURL } from '../utils/constants'
import { addUser } from '../utils/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const Body = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const userData=useSelector((store)=>store.user);
  
  const fetchUser=async()=>{
    if(userData) return;
    try{
      const resData=await axios.get(BasicURL+"/profile/view",{withCredentials:true});

      dispatch(addUser(resData.data));
     

    }
    catch(error){
      if(error.status===401){
        navigate('/login');
      
    }
    console.log(error);
  }
}
  useEffect(()=>{
    fetchUser();
  },[userData]);
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 overflow-auto pt-10">
      <Outlet />
    </main>
    <Footer />
  </div>
  )
}

export default Body
