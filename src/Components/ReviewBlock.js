import React from 'react';
import { useState, useEffect } from 'react';
import StarRating from './StarRating';

export default function ReviewBlock (props){
  const [editMode, setEditMode] = useState(false);
  
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

  function changeStarRating(rating){
    props.handleStarsEdit(rating, props.id)
  }
  
  return(
    <div>
      <div>
        {editMode===true
        ? <button onClick={confirmChanges}>Confirm</button>
        : <button onClick={handleEditMode}>Edit</button>}
        <button onClick={handleDelete}>Delete</button>
      </div>
        {editMode === true
        ? <div>
            <input type= 'text' value = {props.reviewText} onChange={handleReviewInput}/>
            
            <p>{props.datetime}</p>
          </div>
        : <div>
            <p>{props.reviewText} - {[...Array(props.stars)].map((star)=>{return "★"}).join('')}</p>
            <p>{props.datetime}</p>
          </div>}      
    </div>
  )
}