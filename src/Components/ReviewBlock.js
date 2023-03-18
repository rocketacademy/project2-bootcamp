import React from 'react';
import { useState, useEffect } from 'react';
import { retrievePFP } from '../firebase';
import { UserAuth } from '../Context/AuthContext';
import "./ReviewBlock.css"
import { useNavigate } from 'react-router-dom';

export default function ReviewBlock (props){
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [photoURL, setPhotoURL] = useState('https://i.pinimg.com/564x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg');
  
  useEffect(()=>{
    retrievePFP(props.userId, setPhotoURL).then(()=>{
    })
  },[])

  function handleEditMode(){
    setEditMode(!editMode)
  }

  function confirmChanges(){
    setEditMode(!editMode)
    props.confirmChanges(props.reviewText, props.userId);
  }

  function handleReviewInput(e){
    props.handleReviewEdit(e.target.value, props.userId)
  }
  
  function handleDelete(){
    props.handleDelete(props.userId)
  }

  function profileClick(){
    navigate(`/profile/${props.userId}`)
  }

  let editPanel = 
    <div className="edit-panel">
      {editMode===true
        ? <button className="edit-button" onClick={confirmChanges}>Confirm</button>
        : <button className= "edit-button" onClick={handleEditMode}>Edit</button>}
        <button className = "delete-button" onClick={handleDelete}>Delete</button>
    </div>

  return(
    <div className = "review-container">
        {editMode === true
        ? <div>
            <div className="review-name-block">
              <img onClick={profileClick} className = "review-profile-pic" src = {photoURL} alt=''/>
              <p className = "display-name" onClick={profileClick}>{props.userDisplay}</p>
              - <p className="stars"> {[...Array(props.stars)].map((star)=>{return "★"}).join('')}</p>
              <div>
                {(user.uid===props.userId)
                ? editPanel
                : null}
              </div>  
            </div>
            <div className="review-text-edit">
              <input  type= 'text' value = {props.reviewText} onChange={handleReviewInput}/>
            </div>
            <p className="review-date-time">{props.datetime}</p>
          </div>
        : <div className = "review-container">
            <div className="review-name-block">
              <img onClick={profileClick} className = "review-profile-pic" src = {photoURL} alt=''/>
              <p className = "display-name" onClick={profileClick}>{props.userDisplay}</p>
              - <p className="stars"> {[...Array(props.stars)].map((star)=>{return "★"}).join('')}</p>
              <div>
                {(user.uid===props.userId)
                ? editPanel
                : null}
              </div>
            </div>
            <div className="review-text">
              <p >{props.reviewText}</p>
            </div>
            <p className="review-date-time">{props.datetime}</p>
          </div>}  
    </div>
  )
}