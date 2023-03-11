import React from 'react';
import { useState, useEffect } from 'react';
import { onChildAdded, push, ref, set } from "firebase/database";
import { storage, database, auth } from "../firebase";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Movie.css"
import StarRating from './StarRating';

const DB_REVIEWS_KEY = "reviews";

export default function Movie (){
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState('');
  const [rating, setRating] = useState(null);
  const location = useLocation();
  const [imgPath, setImgPath] = useState(`https://image.tmdb.org/t/p/w1280/`);

  const movieId = location.pathname.split("/")[2];
  const movieTitle = location.pathname.split("/")[3].split("%20").join(" ");
  
  useEffect(()=>{
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US`).then(function (response) {
      console.log(response)
      setImgPath(()=> imgPath + response.data.poster_path)
    }).catch(function (error) {
        console.error(error);
    });
  },[])

  useEffect(()=> {
    const reviewsRef = ref(database, DB_REVIEWS_KEY + "/" + movieId);
    // For Text Input
    onChildAdded(reviewsRef, (data) => {
      setReviews((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])

  function handleReviewInput(e){
    setReviewInput(e.target.value)
  }

  function handleReviewSubmit(e){
    e.preventDefault();

    if (rating === null || reviewInput === ''){
      alert('Please enter a rating or review')
    } else {
      const reiewsListRef = ref(database, DB_REVIEWS_KEY+ "/" + movieId);
      const newReviewRef = push(reiewsListRef);
      let currDate = new Date();
      set(newReviewRef, {
        val: reviewInput,
        dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        rating: rating
      });
      setReviewInput('');
    }
  }

  let reviewItems = reviews.map((review) => (
    <div>
      {review.val.val + " - " + [...Array(review.val.rating)].map((star)=>{return "★"}).join('')}<br/>
      {review.val.dateTime}
    </div>
  ));

  function changeStarRating(rating){
    setRating(rating);
  }
  
  return(
    <div>
      <h1>{movieTitle}</h1>
      <img className = "movie-poster" src = {imgPath} alt = ''/>
      <form onSubmit = {handleReviewSubmit}>
        <h6>Write a Review:</h6>
        <StarRating changeStarRating = {changeStarRating}/>
        <input type='text' name='review' value={reviewInput} onChange={handleReviewInput}/>
        <input type='submit'/>
      </form>
      <div>
        {reviewItems}
      </div>
    </div>
  )
}