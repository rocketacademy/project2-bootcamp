import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import "./App.css";
import AuthFormTesting from "./Components/AuthFormTesting";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Quiz from "./Components/Quizzes";
import AppTest from "./AppTest";
import App from "./App";
import QuizAI from "./Components/QuizzesAI";

const libraries = ["places"];

const linkStyle = {
  marginRight: "50px",
  marginLeft: "50px",
  marginTop: "10px",
  marginBottom: "10px",
  textDecoration: "none",
  color: "black",
  fontWeight: "bold",
  fontSize: "30px",
  display: "flex",
  flexDirection: "column",
};

// A separate component to render Links
const AppLinks = () => (
  <>
    <Link to="/" style={linkStyle}>
      Map
    </Link>
    <Link to="/quizzes" style={linkStyle}>
      Quizzes
    </Link>
    <Link to="/map" style={linkStyle}>
      Charles Map
    </Link>
    <Link to="/quizzesAI" style={linkStyle}>
      Quizzes AI
    </Link>
    <Link to="/onboarding" style={linkStyle}>
      Onboarding
    </Link>
  </>
);

const AppMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  console.log(user);

  return (
    <Router>
      {isLoggedIn && ( // Conditionally render the navigation if user is logged in
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              marginRight: "500px",
            }}
          >
            {/* <IconButton
              variant="outlined"
              onClick={(e) => {
                setIsLoggedIn(false);
                signOut(auth);
                setUser({});
              }}
              starticon={<ExitToAppIcon />}
              sx={{ marginLeft: "20px" }}
            >
              <ExitToAppIcon style={{ fontSize: "2.25rem" }} />
            </IconButton> */}
          </div>
        </div>
      )}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/quizzes" element={<Quiz user={user} />} />
            <Route path="/" element={<AppTest />} />
            <Route path="/map" element={<App />} />
            <Route path="/quizzesAI" element={<QuizAI user={user} />} />
          </>
        ) : (
          <>
            <Route path="/quizzes" element={<AuthFormTesting />} />
            <Route path="/" element={<AuthFormTesting />} />
            <Route path="/map" element={<App />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export { AppMain, AppLinks };
