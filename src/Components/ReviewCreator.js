import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import { UserAuth } from '../Context/AuthContext';
import { FaSearch } from 'react-icons/fa';
import SearchResult from './SearchResult';
import StarRating from './StarRating';
import "./ReviewCreator.css";

const DB_REVIEWS_KEY = "reviews";
const DB_MOVIES_KEY = "movies";

export default function ReviewCreator (){
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [reviewInput, setReviewInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [movie, setMovie] = useState(null)
  const [rating, setRating] = useState(null)

  function handleReviewInput(e){
    setReviewInput(e.target.value)
  }

  function handleReviewSubmit(e){
    e.preventDefault();
    if (rating === null || reviewInput === ''){
      alert('Please enter a rating or review')
    } else{
      let currDate = new Date();
      set(ref(database, `${DB_REVIEWS_KEY}/${movie.id}/${user.uid}` ) , {
        user: user.uid,
        val: reviewInput,
        dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        rating: rating
      })
      addMovieDatabase();
      setReviewInput('');
      navigate("/movie/" + movie.id + "/" + movie.title)
    }
  }

  function addMovieDatabase(){
    set(ref(database, `${DB_MOVIES_KEY}/${movie.id}` ) , {
      title: movie.title,
      imgPath: movie.imgPath
    })
  }

  function handleSearchInput(e) {
    setSearchInput(e.target.value);
    fetchSearchResult(e);
  }

  function fetchSearchResult(e){
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US&query=${e.target.value}`).then(function (response) {
    const slicedArray = response.data.results.slice(0,5)
    setSearchResult(slicedArray);
    }).catch(function (error) {
        console.error(error);
    });  
  }

  function handleResultClick(imgPath, title, id, release, synopsis){
    setMovie({
      id: id,
      title: title,
      imgPath: imgPath,
      release: release,
      synopsis: synopsis
    })
    setSearchResult([]);
    setSearchInput('');
  }

  function changeStarRating(rating){
    setRating(rating);
  }

  function handlePosterClick(e){
    let movieTitle = e.target.name.split(' ')
    let updatedMovieTitle = movieTitle.join('%20')
    let movieURL = `/movie/${e.target.id}/${updatedMovieTitle}`
    navigate(movieURL);
  }

  let searchResultItems = searchResult.map((result, id) => (
    <SearchResult handleResultClick = {handleResultClick} movieDetails = {result} key = {id}/>
  ));
  
  return(
    <div className='review-creator-div'>
      <h3>Search for a Movie!</h3>
      <form>
        <div className='search-field-div'>
          <input className='search-field' type='text' name='search' value={searchInput} onChange={handleSearchInput}/>
          <FaSearch className='search-icon'/>
        </div>
      </form>
      <div className='search-bar-div'>
        {searchResultItems}
      </div>
      {movie === null
      ? null
      : <div className = "selected-movie-flex">
          <h1>{movie.title} ({movie.release})</h1>
          <div className='movie-poster-div'>
            <label className='test'>
              <button
                type='button' 
                className="poster-button"
                onClick={handlePosterClick}
                id = {movie.id}
                name = {movie.title}
              />
              <img className = "selected-movie-poster" src = {movie.imgPath} alt = ''/>
            </label>
            <div className='synopsis'>
              <h4>Synopsis</h4>
              <p className='synopsis-text'>{movie.synopsis}</p>
              <form id="create-review-form" className='review-div' onSubmit = {handleReviewSubmit}>
                <h4>Write a Review</h4>
                <StarRating className="stars" changeStarRating = {changeStarRating}/>
                <textarea className='review-text-box' form="create-review-form" name='review' value={reviewInput} onChange={handleReviewInput}/>
                <input className= "review-submit-button" type='submit'/>
              </form>
            </div>
          </div>
        </div>}
    </div>
  )
}