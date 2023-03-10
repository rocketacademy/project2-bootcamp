import React from 'react';
import { Link } from 'react-router-dom'; 

export default function NavBar (){
  return(
    <div>
      <nav>
        <Link exact to="/">Landing Page</Link>
        <Link to="/login">Login</Link>
        <Link to = "/register">Register</Link>
        <Link to = "/feed">Feed</Link>
        <Link to = "/error">Error</Link>
        <Link to = "/:profileId/:profilename">Profile</Link>
        <Link to = "/:movieId/:movietitle">Movie</Link>
      </nav>
    </div>
  )
}



