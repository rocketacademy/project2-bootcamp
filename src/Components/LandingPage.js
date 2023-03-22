import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage (){
  const navigate = useNavigate();
  
  useEffect(()=>{
    console.log('go login')
    redirectToLogin();
  })

  function redirectToLogin(){
    console.log('redirect to login')
    navigate("/login")
  }
  
  return(
    <>
      <h1>LOADING......</h1>
    </>
  )
}