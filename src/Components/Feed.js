import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onChildAdded } from "firebase/database";
import axios from "axios";
import { storage, database, auth } from "../firebase";
import { UserAuth } from "../Context/AuthContext";
import "./Feed.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const DB_MOVIES_KEY = "movies";
const DB_REVIEWS_KEY = "reviews";

export default function Feed() {
  const navigate = useNavigate();
  const { user, logout } = UserAuth();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const moviesRef = ref(database, DB_MOVIES_KEY);
    // For Text Input
    onChildAdded(moviesRef, (data) => {
      setMovies((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  function handleSignOut() {
    console.log("signed out");
    logout();
    navigate("/login");
  }

  function handleCreateReview() {
    console.log("create review");
    navigate("/create-review");
  }

  function handleProfileClick() {
    navigate("/profile/" + user.uid);
  }

  function handlePosterClick(e) {
    console.log(e.target.id);
    let movieTitle = e.target.name.split(" ");
    let updatedMovieTitle = movieTitle.join("%20");
    console.log(updatedMovieTitle);
    let movieURL = `/movie/${e.target.id}/${updatedMovieTitle}`;
    navigate(movieURL);
  }
  function handleHomePageClick(event) {
    console.log(event.target.mainPage);
  }

  console.log(movies);
  let moviesList = movies.map((movie) => (
    <label>
      <input
        type="button"
        className="poster-button"
        onClick={handlePosterClick}
        id={movie.key}
        name={movie.val.title}
      />
      <img className="feed-poster" src={movie.val.imgPath} alt="" />
    </label>
  ));

  return (
    <div className="button">
      <h1>Welcome, {user.displayName}!</h1>
      <button className="add-review" onClick={handleCreateReview}>
        Add a Review
      </button>
      <button className="profile" onClick={handleProfileClick}>
        Profile
      </button>
      <button className="signout" onClick={handleSignOut}>
        Sign Out
      </button>

      <div>{moviesList}</div>
      <button className="main-page" onClick={handleHomePageClick}>
        Main Menu
      </button>
    </div>
  );
}
