import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext';

export default function LandingPage (){
  const navigate = useNavigate();
  const { user } = UserAuth();
  
  useEffect(()=>{
    console.log(user == {})
    console.log(user === null)
    console.log(user === { })
    if(user === {}){
      redirectToFeed();
    } else{
      redirectToLogin();
    }
  }, [])


  function redirectToLogin(){
    console.log('redirect to login')
    navigate("/login")
  }

  function redirectToFeed(){
    console.log('redirect to Feed')
    navigate("/feed")
  }
  
  return(
    <>
      <h1>LOADING......</h1>
    </>
  )
}