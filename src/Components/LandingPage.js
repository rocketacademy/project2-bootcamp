import React, { useEffect } from 'react';
import { UserAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LandingPage (){
  const { user } = UserAuth();
  const navigate = useNavigate();
  
  useEffect(()=>{
    if (user){
      redirectToFeed()
     }else{
      redirectToLogin()
     }
  })

  function redirectToLogin(){
    navigate("/login")
  }
  
  function redirectToFeed(){
    navigate("/feed")
  }

  return(
    <>
      <h1>LOADING......</h1>
    </>
  )
}