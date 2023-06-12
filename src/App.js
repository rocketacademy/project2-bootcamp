import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Welcome";
import Map from "./Components/Map";
import List from "./Components/List";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} />

      {isLoggedIn ? (
        <div className="App">
          <Map />
          <List />
        </div>
      ) : (
        <div>
          <Welcome />
        </div>
      )}
    </div>
  );
};

export default App;
