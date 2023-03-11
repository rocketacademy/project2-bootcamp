import React from 'react';
import "./SearchResult.css"

export default function SearchResult (props){
  const imgPath = `https://image.tmdb.org/t/p/w1280/${props.movieDetails.poster_path}`
  const title = props.movieDetails.title
  const id = props.movieDetails.id

  function handleClick(){
    props.handleResultClick(imgPath, title, id)
  }

  return(
    <div className= "search-flex-container" onClick={handleClick}>
      <img className="search-preview-image" src = {imgPath} alt=''/>
      <p>{props.movieDetails.title}</p>
    </div>
  )
}