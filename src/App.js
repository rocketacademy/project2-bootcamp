import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Welcome";
import Map from "./Components/Map";
import ListExpenses from "./Components/ListExpenses";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });
  }, []);

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} />
      {isLoggedIn ? (
        <div className="App">
          <Map />
          <ListExpenses />
        </div>
      ) : (
        <div className="App">
          <Map />
          <Welcome />
        </div>
      )}
    </div>
  );
};

export default App;
