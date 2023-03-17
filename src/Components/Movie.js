import React from 'react';
import { useState, useEffect } from 'react';
import { ref, set, update, remove, onValue, onChildAdded, get, child} from "firebase/database";
import { database, deleteMovieReview } from "../firebase";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Movie.css"
import StarRating from './StarRating';
import ReviewBlock from './ReviewBlock';
import { UserAuth } from '../Context/AuthContext';
import { connectStorageEmulator } from 'firebase/storage';

const DB_REVIEWS_KEY = "reviews";
const DB_MOVIES_KEY = "movies";
const DB_USERS_KEY = "users";

export default function Movie (){
  const { user } = UserAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState('');
  const [rating, setRating] = useState(null);
  const [watched, setWatched] = useState(false);
  const [imgPath, setImgPath] = useState(`https://image.tmdb.org/t/p/w1280/`);
  const location = useLocation();

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
    onChildAdded(reviewsRef, (data) => {
      setReviews((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])

  useEffect(()=>{
    if(user.uid){
      const userRef = ref(database, DB_USERS_KEY);
      get(child(userRef, user.uid)).then((snapshot) => {
      if (snapshot.exists() && snapshot.val().moviesWatched) {
        if(snapshot.val().moviesWatched.indexOf(movieId) !== -1){
          setWatched(true)
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  },[user.uid])


  function handleReviewSubmit(e){
    e.preventDefault();

    if (rating === null || reviewInput === ''){
      alert('Please enter a rating or review')
    } else {
      let currDate = new Date();
      set(ref(database, `${DB_REVIEWS_KEY}/${movieId}/${user.uid}` ) , {
        user: user.displayName,
        val: reviewInput,
        dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        rating: rating
      })
      addMovieDatabase();
      setReviewInput('');
    }
  }

  function addMovieDatabase(){
    set(ref(database, `${DB_MOVIES_KEY}/${movieId}` ) , {
      title: movieTitle,
      imgPath: imgPath
      })
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

  function confirmChanges(reviewText, id ){
    const reviewRef = ref(database, DB_REVIEWS_KEY+ "/" + movieId + "/" + id);
    update(reviewRef, {
      val: reviewText,
    })
  }

  function handleDelete (id){
    const reviewRef = ref(database, DB_REVIEWS_KEY+ "/" + movieId + "/" + id);
    deleteMovieReview(reviewRef, checkMovieDatabase)
    let index = -1;
    for (let i = 0; i < reviews.length; i++){
      if (reviews[i].key === id){
        index = i
      }
    }
    let updatedReviewsArr = [...reviews]
    updatedReviewsArr.splice(index, 1)
    setReviews(updatedReviewsArr)
  }
  

  function checkMovieDatabase(){
    const reviewRef = ref(database, `${DB_REVIEWS_KEY}/${movieId}`)
    onValue(reviewRef, (snapshot)=>{
      if(snapshot.val()===null){
        console.log('movie gone')
        const movieRef = ref(database, `${DB_MOVIES_KEY}/${movieId}`)
        remove(movieRef)
      }
    })
  }

  function handleWatched(){
    const userRef = ref(database, DB_USERS_KEY);
    if (watched === false){
      get(child(userRef, user.uid)).then((snapshot) => {
        if (snapshot.val() && typeof snapshot.val().moviesWatched === "undefined") {
          update(ref(database, `${DB_USERS_KEY}/${user.uid}` ) , {
            moviesWatched: [movieId]
          })
        } else if (snapshot.val() && snapshot.val().moviesWatched){
          let updatedArr = [...snapshot.val().moviesWatched, movieId]
          update(ref(database, `${DB_USERS_KEY}/${user.uid}` ) , {
            moviesWatched: updatedArr
          })
        }
      })
    } else if (watched === true){
      get(child(userRef, user.uid)).then((snapshot) => {
        if (snapshot.val()){
          let updatedArr = [...snapshot.val().moviesWatched]
          let index = updatedArr.indexOf(movieId)
          console.log(index)
          updatedArr.splice(index,1);
          console.log(updatedArr)
          update(ref(database, `${DB_USERS_KEY}/${user.uid}` ) , {
            moviesWatched: updatedArr
          })
          }
        })
      }
    setWatched((prev)=> !prev)
  }

  function changeStarRating(rating){
    setRating(rating);
  }

  function handleReviewInput(e){
    setReviewInput(e.target.value)
  }

  let reviewItems = reviews.map((review) => {
    return (
    <div>
      <ReviewBlock
      reviewText = {review.val.val}
      userId = {review.key}
      userDisplay = {review.val.user}
      datetime = {review.val.dateTime} 
      stars = {review.val.rating}
      handleReviewEdit ={handleReviewEdit}
      confirmChanges = {confirmChanges}
      handleDelete = {handleDelete}
      />
    </div>
   )}
  );

  return(
    <div>
      <h1>{movieTitle}</h1>
      <img className = "movie-poster" src = {imgPath} alt = ''/>
      <button onClick={handleWatched}>Watched: {`${watched}`}</button>
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

