//--------- Firebase ---------//

import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  push,
  remove,
  ref,
  update,
} from "firebase/database";

//----------- React -----------//

import React, { useEffect, useState } from "react";

//-------- React Router --------//

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

//---------- Screens  ----------//

import SplashScreen from "./Screens/SplashScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen/SignUpScreen";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import ExploreScreen from "./Screens/ExploreScreen/ExploreScreen";
import SearchPokeScreen from "./Screens/SearchPokeScreen/SearchPokeScreen";

//--------- Variables  ---------//

const DB_USERS_KEY = "users";
const DB_IMAGES_KEY = "images";
const UserContext = React.createContext(null);
const NavContext = React.createContext(null);
const userObj = {
  uid: null,
  email: null,
  name: null,
  pic: null,
};

//------------------------------//

const App = () => {
  const [user, setUser] = useState(userObj);
  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  useEffect(() => {
    // const databaseRef = ref(database, DB_USERS_KEY);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          pic: user.photoURL,
        });
      }
    });
  }, []);

  const handleLogOut = async () => {
    await setUser(userObj);
    signOut(auth);
  };

  return (
    <NavContext.Provider value={{ navigate, handleNavigate }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={user.uid ? <Navigate to="/profile" /> : <SplashScreen />}
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/explore" element={<ExploreScreen />} />
            <Route
              path="/profile"
              element={<ProfileScreen handleLogOut={handleLogOut} />}
            />
            <Route path="/search-poke" element={<SearchPokeScreen />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </NavContext.Provider>
  );
};

export default App;
export { UserContext, NavContext };
