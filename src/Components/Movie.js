import React from 'react';
import { useState, useEffect } from 'react';
import { onChildAdded, onChildRemoved, push, ref, set, get, update, remove } from "firebase/database";
import { storage, database, auth  } from "../firebase";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Movie.css"
import StarRating from './StarRating';
import ReviewBlock from './ReviewBlock';

const DB_REVIEWS_KEY = "reviews";
const DB_MOVIES_KEY = "movies";

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
  }, [])

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
      addMovieDatabase();
      setReviewInput('');
    }
  }

  function addMovieDatabase(){
    if (reviews.length === 0){
      const moviesListRef = ref(database, DB_MOVIES_KEY);
      const newMovieRef = push(moviesListRef);
      set(newMovieRef, {
        id: movieId,
        title: movieTitle,
        imgPath: imgPath
      });
    }
  }

  function handleReviewEdit(input, id){
    let index = -1;
    for (let i = 0; i < reviews.length; i++){
      if(reviews[i].key === id){
        index = i;
      }
    }
    
    let updatedReview = {...reviews[index]};
    updatedReview.val.val = input;
    

    console.log(updatedReview)

    let newReviewsArray  = [...reviews];

    newReviewsArray.splice(index, 1, updatedReview);

    setReviews(newReviewsArray);
  }

  function handleStarsEdit( rating, id){
    let index = -1;
    for (let i = 0; i < reviews.length; i++){
      if(reviews[i].key === id){
        index = i;
      }
    }
    
    let updatedReview = {...reviews[index]};
    updatedReview.val.rating = rating;

    let newReviewsArray  = [...reviews];

    newReviewsArray.splice(index, 1, updatedReview);

    setReviews(newReviewsArray);
  }

  function confirmChanges(reviewText, id ){
    const reviewRef = ref(database, DB_REVIEWS_KEY+ "/" + movieId + "/" + id);
    update(reviewRef, {
      val: reviewText,
    })
  }

  function handleDelete(id){
    const reviewRef = ref(database, DB_REVIEWS_KEY+ "/" + movieId + "/" + id);
    let updatedArray = [];
    if (reviews.length >1){
      let index = -1;
      for (let i = 0; i < reviews.length; i++){
        if(reviews[i].key === id){
          console.log('true')
          index = i;
          updatedArray = [...reviews].splice(0, 1)
        }
      }
    }
    
    
    console.log(updatedArray);
    setReviews(updatedArray);
    remove(reviewRef);
  }

  let reviewItems = reviews.map((review) => (
      <div>
        <ReviewBlock
        reviewText = {review.val.val}
        id = {review.key}
        datetime = {review.val.dateTime} 
        stars = {review.val.rating}
        handleReviewEdit ={handleReviewEdit}
        handleStarsEdit = {handleStarsEdit}
        confirmChanges = {confirmChanges}
        handleDelete = {handleDelete}
        />
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