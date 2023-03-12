import React from 'react';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth" 
import { ref, onChildAdded } from "firebase/database"
import axios from 'axios';
import { storage, database, auth } from "../firebase";

const DB_MOVIES_KEY = "movies";
const DB_REVIEWS_KEY = "reviews";

export default function Feed (){
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(()=> {
    const moviesRef = ref(database, DB_MOVIES_KEY);
    // For Text Input
    onChildAdded(moviesRef, (data) => {
      setMovies((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])

  function handleSignOut(){
    console.log('signed out')
    navigate('/login');
  }
  
  function handleCreateReview(){
    console.log('create review')
    navigate('/create-review')
  }

  let moviesList = movies.map((movie)=>(
    <img src ={movie.val.imgPath} alt=''/> 
  ))

  return(
    <div>
      <button>Home</button>
      <button onClick={handleCreateReview}>Add a Review</button>
      <button>Profile</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <div>
        {moviesList}
      </div>
    </div>
  )
}