import React from 'react';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onChildAdded } from "firebase/database"
import axios from 'axios';
import { storage, database, auth } from "../firebase";
import { UserAuth } from '../Context/AuthContext';
import "./Feed.css"

const DB_MOVIES_KEY = "movies";
const DB_REVIEWS_KEY = "reviews";

export default function Feed (){
  const navigate = useNavigate();
  const { user , logout } = UserAuth();
  const [movies, setMovies] = useState([]);

  useEffect(()=> {
    const moviesRef = ref(database, DB_MOVIES_KEY);
    // For Text Input
    onChildAdded(moviesRef, (data) => {
      setMovies((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])

  function handlePosterClick(e){
    let movieTitle = e.target.name.split(' ')
    let updatedMovieTitle = movieTitle.join('%20')
    let movieURL = `/movie/${e.target.id}/${updatedMovieTitle}`
    navigate(movieURL);
  }

  let moviesList = movies.map((movie)=>(
    <label>
      <input
      type='button' 
      className="poster-button"
      onClick={handlePosterClick}
      id = {movie.key}
      name = {movie.val.title}
      />
      <img
      className= 'feed-poster'
      src ={movie.val.imgPath}
      alt=''/>
    </label> 
  ))

  return(
    <div>
      <div className="text-div">
        <h1>Welcome to Film-O-Rama, {user.displayName}!</h1>
        <p>Check out some movies other users are watching!</p>
      </div>
      <div>
        {moviesList}
      </div>
    </div>
  )
}