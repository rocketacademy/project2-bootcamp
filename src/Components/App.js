import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import LandingPage from "./LandingPage"
import Login from "./Login"
import Register from "./Register"
import Feed from "./Feed"
import Error from "./Error"
import Movie from "./Movie"
import Profile from "./Profile"
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
            <Routes>
              <Route path="/" element= {<LandingPage />}/>
              <Route path="/login" element= {<Login />}/>
              <Route path="/register" element= {<Register/>}/>
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
