//--------- Firebase ---------//

import { database, storage, auth } from "./firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import {
//   onChildAdded,
//   onChildRemoved,
//   onChildChanged,
//   push,
//   remove,
//   ref,
//   update,
// } from "firebase/database";

//----------- React -----------//

import React, { useEffect } from "react";

//-------- React Router --------//

import { Routes, Route } from "react-router-dom";

//---------- Screens  ----------//

import SplashScreen from "./Screens/SplashScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen";

//--------- Variables  ---------//

const DB_USERS_KEY = "users";
const DB_IMAGES_KEY = "images";

//------------------------------//

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </div>
  );
};

export default App;
