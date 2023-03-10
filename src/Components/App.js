import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link
} from "react-router-dom";
import LandingPage from "./LandingPage"
import Login from "./Login"
import Feed from "./Feed"
import Error from "./Error"
import Movie from "./Movie"
import Profile from "./Profile"
import "./App.css";

function NavBar (){
  return(
    <div>
      <nav>
        <Link exact to="/">Landing Page</Link>
        <Link to="/login">Login</Link>
        <Link to = "/feed">Feed</Link>
        <Link to = "/error">Error</Link>
        <Link to = "/:profileId/:profilename">Profile</Link>
        <Link to = "/:movieId/:movietitle">Movie</Link>
      </nav>
    </div>
  )
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
            <Routes>
              <Route exact path="/" element= {<LandingPage />}/>
              <Route path="/login" element= {<Login />}/>
              <Route path="/feed" element= {<Feed />}/>
              <Route path="*" element= {<Error/>}/>
              <Route path="/:profileId/:profilename" element= {<Profile/>}/>
              <Route path="/:movieId/:movietitle" element= {<Movie/>}/>
            </Routes>            
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
