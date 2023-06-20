import React, { useEffect, useState } from "react";
import "./App.css";
import ResponsiveAppBar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";
import DefineRoutesHere from "./routes/routes";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (userObj) => {
      // If user is logged in, save logged-in user to state
      if (userObj) {
        setLoggedInUser(userObj);
        return;
      }
      // Else set logged-in user in state to null
      setLoggedInUser(null);
    });
  }, [loggedInUser]);

  return (
    <div className="App">
      {loggedInUser !== null && (
        <ResponsiveAppBar loggedInUser={loggedInUser} />
      )}
      <header className="App-header">
        <br />
        <DefineRoutesHere />
      </header>
    </div>
  );
};

export default App;
