import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onChildAdded, push, ref, set } from "firebase/database";
import { storage, database, auth } from "../firebase";
import axios from 'axios';
import SearchResult from './SearchResult';
import "./ReviewCreator.css";
import StarRating from './StarRating';

const DB_REVIEWS_KEY = "reviews";

export default function ReviewCreator (){
  const navigate = useNavigate();
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
      const reiewsListRef = ref(database, DB_REVIEWS_KEY + "/" + movie.id);
      const newReviewRef = push(reiewsListRef);
      let currDate = new Date();
      set(newReviewRef, {
        val: reviewInput,
        rating: rating,
        dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      });
      setReviewInput('');
      navigate("/movie/" + movie.id + "/" + movie.title)
    }
  }

  function handleSearchInput(e) {
    setSearchInput(e.target.value);
    fetchSearchResult(e);
  }

  function fetchSearchResult(e){
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US&query=${e.target.value}`).then(function (response) {
    const slicedArray = response.data.results.slice(0,5)
    console.log(response.data.results)
    setSearchResult(slicedArray);
    console.log(searchResult);
    }).catch(function (error) {
        console.error(error);
    });  
  }

  function handleResultClick(imgPath, title, id){
    setMovie({
      id: id,
      title: title,
      imgPath: imgPath
    })
    setSearchResult([]);
    setSearchInput('');
  }

  function changeStarRating(rating){
    setRating(rating);
  }

  let searchResultItems = searchResult.map((result, id) => (
    <SearchResult handleResultClick = {handleResultClick} movieDetails = {result} key = {id}/>
  ));
  
  console.log(rating)
  console.log(reviewInput)
  return(
    <div>
      <h1>REVIEW CREATOOOOOOOOOR</h1>
      <form>
        <input type='text' name='search' value={searchInput} onChange={handleSearchInput}/>
        {searchResultItems}
      </form>
      {movie === null
      ? null
      : <div className = "selected-movie-flex">
          <h1>{movie.title}</h1>
          <img className = "selected-movie-poster" src= {movie.imgPath} alt = '' />
          <h6>Rating</h6><StarRating changeStarRating = {changeStarRating}/>
        </div>}
      
      <form onSubmit = {handleReviewSubmit}>
        <h6>Review:</h6>
        <input type='text' name='review' value={reviewInput} onChange={handleReviewInput}/>
        <input type='submit'/>
      </form>
    </div>
  )
}