import React from 'react';
import { useState, useEffect } from 'react';
import { ref, set, update, remove, onValue, onChildAdded, get, child} from "firebase/database";
import { database, deleteMovieReview } from "../firebase";
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Movie.css"
import StarRating from './StarRating';
import ReviewBlock from './ReviewBlock';
import { UserAuth } from '../Context/AuthContext';
import greeneye from "../Images/greeneye.png";
import greyeye from "../Images/greyeye.png";
import { useNavigate } from 'react-router-dom';

const DB_REVIEWS_KEY = "reviews";
const DB_MOVIES_KEY = "movies";
const DB_USERS_KEY = "users";

export default function Movie (){
  const { user } = UserAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState('');
  const [ description, setDescription ] = useState('');
  const [ release, setRelease ] = useState('')
  const [ cast, setCast ] = useState('')
  const [rating, setRating] = useState(null);
  const [watched, setWatched] = useState(false);
  const [imgPath, setImgPath] = useState(`https://image.tmdb.org/t/p/w1280/`);
  const [totalRating, setTotalRating] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const movieId = location.pathname.split("/")[2];
  const movieTitle = location.pathname.split("/")[3].split("%20").join(" ");
  
  useEffect(()=>{
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US`).then(function (response) {
      setImgPath(()=> imgPath + response.data.poster_path)
      setDescription(()=> response.data.overview)
      setRelease(()=> response.data.release_date.substring(0,4))
    }).catch(function (error) {
        console.error(error);
    });
  },[])

  useEffect(()=>{
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US`).then(function (response) {
      setCast(response.data.cast)
    }).catch(function (error) {
        console.error(error);
    });
  },[])


  useEffect(()=> {
    const reviewsRef = ref(database, DB_REVIEWS_KEY + "/" + movieId);
    onChildAdded(reviewsRef, (data) => {
      setTotalRating((prev)=> prev + data.val().rating)
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
        user: user.uid,
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
      addMovieDatabase();
    } else if (watched === true){
      get(child(userRef, user.uid)).then((snapshot) => {
        if (snapshot.val()){
          let updatedArr = [...snapshot.val().moviesWatched]
          let index = updatedArr.indexOf(movieId)
          updatedArr.splice(index,1);
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

  function handleFeed(){
    navigate("/feed")
  }

  let reviewItems = reviews.map((review) => {
    return (
    <div className="review-container">
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

  let castItems
  if(cast){
    castItems = cast.slice(0,4).map((cast) => {
    return (
     <div className="cast-div">
      <img className ="cast-photo"src={`https://image.tmdb.org/t/p/w1280/${cast.profile_path}`} alt=''/>
      <a className="cast-link" href= {`https://www.google.com/search?q=${cast.name.split(" ").join("+")}`}>{cast.name}</a>
     </div> 
    )}
  );
  }
  
  
  return(
    <div className = "movie-page-flex">
      <button className='back-button' onClick={handleFeed}>Feed</button>
      <h1>{movieTitle} ({release})</h1>
      <div className='movie-poster-div'>
        <img className = "movie-poster" src = {imgPath} alt = ''/>
        <div className='synopsis'>
          <h4>Synopsis</h4>
          <p className='synopsis-text'>{description}</p>
          <h4>Cast</h4>
          {castItems}
          <div className='movie-details-flex'>
            <div className = "watched-div">
              <h6 className="watched-text">{watched ? "Watched" : "Watch"} </h6> 
              <img className="eye-button" onClick = {handleWatched} src= {watched ? greeneye : greyeye} alt='' /> 
            </div>
            <div className = "watched-div">
              <h6>Average Rating</h6>
              <h6 className="avg-stars">{totalRating/reviews.length} ★</h6>
            </div>
          </div>
            <div className="write-a-review">
              <form name="review-form" onSubmit = {handleReviewSubmit}>
                <h6 className="watched-text">Write a Review</h6>
                <StarRating changeStarRating = {changeStarRating}/>
                <textarea form="review-form" name='review' className="review-box" value={reviewInput} onChange={handleReviewInput}/>
                <input className= "review-submit" type='submit'/>
              </form>
            </div>  
          </div>
      </div>
      <div className="review-flex-container">
        {reviewItems}
      </div>
    </div>      
  )
}
