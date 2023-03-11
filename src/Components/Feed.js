import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth" 
import { storage, database, auth } from "../firebase";

export default function Feed (){
  const navigate = useNavigate();

  function handleSignOut(){
    console.log('signed out')
    navigate('/login');
  }
  
  function handleCreateReview(){
    console.log('create review')
    navigate('/create-review')
  }

  return(
    <div>
      <button>Home</button>
      <button onClick={handleCreateReview}>Add a Review</button>
      <button>Profile</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}