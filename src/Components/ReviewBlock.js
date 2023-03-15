import React from 'react';
import { useState, useEffect } from 'react';
import { retrievePFP } from '../firebase';
import { UserAuth } from '../Context/AuthContext';
import "./ReviewBlock.css"

export default function ReviewBlock (props){
  const { user } = UserAuth();
  const [editMode, setEditMode] = useState(false);
  const [photoURL, setPhotoURL] = useState('https://i.pinimg.com/564x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg');
  
  useEffect(()=>{
    retrievePFP(props.userId, setPhotoURL)
  },[])

  function handleEditMode(){
    setEditMode(!editMode)
  }

  function confirmChanges(){
    setEditMode(!editMode)
    props.confirmChanges(props.reviewText, props.id);
  }

  function handleReviewInput(e){
    props.handleReviewEdit(e.target.value, props.id)
  }
  
  function handleDelete(){
    props.handleDelete(props.id)
  }

  let editPanel = 
    <div>
      {editMode===true
        ? <button onClick={confirmChanges}>Confirm</button>
        : <button onClick={handleEditMode}>Edit</button>}
        <button onClick={handleDelete}>Delete</button>
    </div>

  return(
    <div>
        {editMode === true
        ? <div>
            <img className = "review-profile-pic" src = {photoURL} alt=''/>
            <p>{props.userDisplay}</p>
            <input type= 'text' value = {props.reviewText} onChange={handleReviewInput}/>
            <p>{props.datetime}</p>
          </div>
        : <div>
            <img className = "review-profile-pic" src = {photoURL} alt=''/>
            <p>{props.userDisplay}</p>
            <p>{props.reviewText} - {[...Array(props.stars)].map((star)=>{return "★"}).join('')}</p>
            <p>{props.datetime}</p>
          </div>}
          <div>
            {(user.uid===props.userId)
            ? editPanel
            : null}
          </div>    
    </div>
  )
}