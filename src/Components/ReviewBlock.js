import React from 'react';
import { useState, useEffect } from 'react';
import { retrievePFP, database } from '../firebase';
import { UserAuth } from '../Context/AuthContext';
import { ref, child, get } from 'firebase/database'
import "./ReviewBlock.css"
import { useNavigate } from 'react-router-dom';

const DB_USERS_KEY = "users";

export default function ReviewBlock (props){
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [ displayName, setDisplayName ] = useState('')
  const [editMode, setEditMode] = useState(false);
  const [photoURL, setPhotoURL] = useState('https://i.pinimg.com/564x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg');
  
  useEffect(()=>{
    retrievePFP(props.userId, setPhotoURL).then(()=>{
    })
  },[])

  useEffect(()=>{
    const userRef = ref(database, DB_USERS_KEY);
    get(child(userRef, props.userId)).then((snapshot) => {
      if (snapshot.exists()) {
        setDisplayName(snapshot.val().displayName);
      }
    }).catch((error) => {
      console.error(error);
    });
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
    <div>
      {editMode===true
        ? <button className="edit-button" onClick={confirmChanges}>Confirm</button>
        : <button className= "edit-button" onClick={handleEditMode}>Edit</button>}
        <button className = "delete-button" onClick={handleDelete}>Delete</button>
    </div>

  return(
    <>
        {editMode === true
        ? <div>
            <div className="review-name-block">
              <img onClick={profileClick} className = "review-profile-pic" src = {photoURL} alt=''/>
              <p className = "display-name" onClick={profileClick}>{displayName}</p>
              - <p className="stars"> {[...Array(props.stars)].map((star)=>{return "★"}).join('')}</p>
              <div>
                {(user.uid===props.userId)
                ? editPanel
                : null}
              </div>  
            </div>
            <div className="review-text-edit">
              <textarea className='edit-box' autofocus value = {props.reviewText} onChange={handleReviewInput}/>
            </div>
            <p className="review-date-time">{props.datetime}</p>
          </div>
        : <div>
            <div className="review-name-block">
              <img onClick={profileClick} className = "review-profile-pic" src = {photoURL} alt=''/>
              <p className = "display-name" onClick={profileClick}>{displayName}</p>
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
    </>
  )
}