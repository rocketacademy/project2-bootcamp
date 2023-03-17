import React, { useEffect, useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { ref, child, get, onChildAdded, onValue } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Profile.css"

const DB_USERS_KEY = "users";
const DB_MOVIES_KEY = "movies";

export default function Profile(){
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({displayName:'', photoURL: '', moviesWatched: []})
  const [movies, setMovies] = useState([])
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  useEffect(()=>{
    const userRef = ref(database, DB_USERS_KEY);
    get(child(userRef, userId)).then((snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
  },[])

  useEffect(()=> {
    const moviesRef = ref(database, DB_MOVIES_KEY);
    // For Text Input
    onChildAdded(moviesRef, (data) => {
      console.log(data.val())
      setMovies((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])

  function handleProfileEdit(){
    navigate("/create-profile")
  }

  function handlePosterClick(e){
    let movieTitle = e.target.name.split(' ')
    let updatedMovieTitle = movieTitle.join('%20')
    let movieURL = `/movie/${e.target.id}/${updatedMovieTitle}`
    navigate(movieURL);
  }
  
  let moviesList;
  if(movies && profile.moviesWatched){
    moviesList = movies.map((movie)=>{
      if (profile.moviesWatched){
        for(let i =0; i < movies.length; i++){
          if(profile.moviesWatched.indexOf(movie.key)!==-1){
            return(<label>
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
              alt=''
              />
              </label>
            )
          } else{
            return null
          }
        }
      } 
    })
  }
  
  


  return(
  <div>
    {userId === user.uid
    ? <button onClick={handleProfileEdit}>Edit Profile</button>
    : null}
    <img src={profile.photoURL} alt=''/>
    <h3>{profile.displayName}</h3>
    <br/>
    <h3>Films Watched:</h3>
    <div>
      {moviesList}
    </div>
  </div>)
}