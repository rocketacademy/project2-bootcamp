import React from 'react';
import { useState, useEffect } from 'react';
import { FaStar} from 'react-icons/fa';
import "./StarRating.css";

export default function StarRating (props){
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(()=>{
    props.changeStarRating(rating)
  })

  return(
    <div>
      {[...Array(5)].map((star, counter)=>{
        const ratingValue = counter + 1 
        return(
          <label>
            <input
            type='radio' 
            name = "rating" 
            className = "radio"
            value = {ratingValue}
            onClick={()=>setRating(ratingValue)}
            />
            <FaStar
            className ="star"
            onMouseEnter={()=>setHover(ratingValue)}
            onMouseLeave={()=>setHover(null)}
            color= {ratingValue <= (hover || rating) ? "#ffe23b" : "#808080" }/>
          </label>
        )
      })}
    </div>
  )
}