import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isBrowser } from "react-device-detect";
import { Button } from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export default function App() {
  const [user, setUser] = useState(null);
  const navi = useNavigate();
  const path = useLocation();
  //useEffect to setUser
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      setUser(user);
    });
  });

  const userDisplay = (
    <div>
      {path.pathname.substring(0, 5) !== "/quiz" && (
        <NaviBar user={user} setUser={setUser} />
      )}
      <div className="outlet">
        <Outlet context={[user, setUser]} />
      </div>
    </div>
  );

  //Display for User haven't login
  const nonUserDisplay = (
    <div className="App">
      <div className="intro-page">
        {/* <img src={logo} alt="logo" className="logo" /> */}
        <div className="intro-page-right-layout">
          <h1>Master Spanish effortlessly with Lingo</h1>
          <div className="front-page-button">
            <Button
              className="register-button"
              variant="contained"
              onClick={() => navi("/register")}
            >
              Register
            </Button>
            <p>or</p>
            <Button
              className="register-button"
              variant="contained"
              onClick={() => navi("/signin")}
            >
              Sign in
            </Button>
          </div>
        </div>
        <div className="intro-page-left-layout">
          <img className="intro-image" src="intro.gif" alt="Home" />
        </div>
      </div>
      <div className="intro-features-page">
        <h1>Our features: </h1>
        <br />

        <LibraryBooksIcon fontSize="large" />
        <h5>Comprehensive Vocabulary</h5>
        <p>
          Access over 80,000 entry words translated from Merriam-Webster's
          Dictionary.
        </p>
        <br />

        <GraphicEqIcon fontSize="large" />
        <h5>Text-to-Speech Pronunciation</h5>
        <p>Learn accurate pronunciation through our text-to-speech feature.</p>
        <br />

        <SchoolIcon />
        <h5>Interactive Reviews:</h5>
        <p>
          Reinforce your understanding with our simple straightforward review
          exercises.
        </p>
        <br />

        <QuizIcon />
        <h5>Dual Quiz Modes</h5>
        <p>
          Challenge yourself with two quiz modes for an engaging and effective
          learning experience.
        </p>
        <br />

        <TravelExploreIcon />
        <h5>Marketplace</h5>
        <p>
          Explore and add decks created by others, expanding your vocabulary
          with diverse sets from the community.
        </p>
        <br />
      </div>
    </div>
  );

  return user ? (
    <DndProvider backend={isBrowser ? HTML5Backend : TouchBackend}>
      {userDisplay}
    </DndProvider>
  ) : (
    nonUserDisplay
  );
}
