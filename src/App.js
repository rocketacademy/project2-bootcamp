import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase.js";

import Login from "./pages/Login.js";
import Explore from "./pages/Explore/Explore.js";
import Search from "./pages/Search.js";
import Create from "./pages/Create.js";
import Profile from "./pages/Profile.js";
import ErrorPage from "./pages/ErrorPage.js";
import TripProvider from "./Provider/TripProvider";
import CoordinatesProvider from "./Provider/CoordinatesProvider";

import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

const App = (props) => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const infoToPass = {
    user,
    setUser,
    username,
    setUsername,
    isLoggedIn,
    setIsLoggedIn,
  };

  // that empty [] at the end is the condition for the useEffect to run - useEffect only runs when the stuff in the brackets changes. if nothing is in the brackets, it only runs once on startup, making the whole useEffect block equal to a componentDidMount
  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        // User signed in
        setUser(userInfo);
        setIsLoggedIn(true);

        ///////////redirect to "/Feed" page//////////////////
      } else {
        // No sign in user
        setUser({});
        setIsLoggedIn(false);
        ///////////redirect to "/" Login Page//////////////////
      }
    });
  }, []);

  return (
    <UserContext.Provider value={infoToPass}>
      <TripProvider>
        <CoordinatesProvider>
          <Routes>
            <Route path="/" element={<Login />} errorElement={<ErrorPage />} />
            <Route
              path="/Explore"
              element={<Explore />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/Search"
              element={<Search />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/Create"
              element={<Create />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/Profile"
              element={<Profile />}
              errorElement={<ErrorPage />}
            />
          </Routes>
          </CoordinatesProvider>
        </TripProvider>
      </UserContext.Provider>
  );
};

export default App;
