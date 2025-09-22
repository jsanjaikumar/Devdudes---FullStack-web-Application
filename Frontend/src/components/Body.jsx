import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice"; 
import { BASE_URL } from "../utils/constants";
import axios from  "axios"

const Body = () => {
  const userData = useSelector((store) => store.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async ()=>{
    
  try{
    if (userData) return;
    const res = await axios.get( BASE_URL + "/profile/view", {withCredentials: true})
    dispatch(addUser(res.data));
  }catch(err){
    if(err.status == 401){
      navigate("/login");
    }
    console.error(err)
  }
  }
  

  useEffect(()=> {
    fetchUser()
  }, [])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
