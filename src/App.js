import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Welcome";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });
  }, []);
  console.log(isLoggedIn);
  return (
    <>
      <NavBar />
      {/* <Outlet isLoggedIn={true} /> */}
      {isLoggedIn ? <Outlet /> : <Welcome />}
    </>
  );
};

export default App;
