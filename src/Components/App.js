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
import ReviewCreator from "./ReviewCreator"
import "./App.css";
import { AuthContextProvider } from "../Context/AuthContext";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element= {<LandingPage />}/>
              <Route path="/login" element= {<Login />}/>
              <Route path="/feed" element= {<Feed />}/>
              <Route path="*" element= {<Error/>}/>
              <Route path="/profile" element= {<Profile/>}/>
              <Route path="/movie/:movieId/:movietitle" element= {<Movie/>}/>
              <Route path="/create-review" element = {<ReviewCreator/>}/>
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>            
      </header>
    </div>
  );
}

export default App;
