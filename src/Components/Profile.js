import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext'
import { upload } from '../firebase';
import "./Profile.css"

export default function Profile (){
  const navigate = useNavigate();
  const { user , logout } = UserAuth();
  const [ bio, setBio ] = useState('');
  const [ profilePic, setProfilePic] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ photoURL, setPhotoURL] = useState('https://i.pinimg.com/564x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg')
  
  useEffect(()=>{
    if(user ?.photoURL){
      setPhotoURL(user.photoURL)
    }
  }, [user.photoURL])

  function handleBioEdit (e){
    setBio(()=> e.target.value)
  }
  
  function handleLogout(){
    logout();
    navigate("/login")
  }

  function handleSubmit(e){
    e.preventDefault();
  }

  function handleFile(e){
    if(e.target.files[0]){
      setProfilePic(e.target.files[0])
    }
  }

  function uploadProfilePic (){
    upload(profilePic, user, setLoading);
  }


  return(
    <div>
      <img className ="profile-pic" src={photoURL} alt=''/><br/>
      Profile Picture
      <br/>
      <input
      type="file"
      accept="image/*"
      onChange = {handleFile}/>
      <button onClick = {uploadProfilePic} disabled={!profilePic || loading}>Upload</button>
      <form id="profile-create" onSubmit={handleSubmit}>
        Email: <input type="text" disabled value = {user.email}/>
        <br/>
        Bio: <textarea form = "profile-create" name = "bio" onChange = {handleBioEdit}/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      <br/>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}