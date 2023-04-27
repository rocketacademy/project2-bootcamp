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

import { Routes, Route } from "react-router-dom";

//---------- Screens  ----------//

import SplashScreen from "./Screens/SplashScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen/SignUpScreen";
import ProfileScreen from "./Screens/ProfileScreen";

//--------- Variables  ---------//

const DB_USERS_KEY = "users";
const DB_IMAGES_KEY = "images";
const UserContext = React.createContext(null);
const userObj = {
  uid: null,
  email: null,
  name: null,
  pic: null,
};

//------------------------------//

const App = () => {
  const [user, setUser] = useState(userObj);

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

  const handleLogOut = () => {
    signOut(auth);
    setUser(userObj);
  };

  return (
    <UserContext.Provider value={user}>
      <div className="App">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen setUser={setUser} />} />
          <Route
            path="/profile"
            element={<ProfileScreen handleLogOut={handleLogOut} />}
          />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
export { UserContext };
