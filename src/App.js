//--------- Firebase ---------//

import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, onChildAdded } from "firebase/database";

//----------- React -----------//

import React, { useEffect, useState } from "react";

//-------- React Router --------//

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

//---------- Screens  ----------//

import SplashScreen from "./Screens/SplashScreen/SplashScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen/SignUpScreen";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import PokeStatsScreen from "./Screens/PokeStatsScreen/PokeStatsScreen";
import ExploreScreen from "./Screens/ExploreScreen/ExploreScreen";
import SearchPokeScreen from "./Screens/SearchPokeScreen/SearchPokeScreen";
import SearchUserScreen from "./Screens/SearchUserScreen/SearchUserScreen";

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
  const [userList, setUserList] = useState([]);
  const [topten, setTopten] = useState(null);
  const [toptenorder, setToptenorder] = useState([]);
  const [wishlist, setWishlist] = useState(null);
  const [wishlistorder, setWishlistorder] = useState(null);

  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  useEffect(() => {
    const usersRef = ref(database, DB_USERS_KEY);

    onChildAdded(usersRef, (data) => {
      setUserList((prevUsers) => [...prevUsers, data.key]);
    });

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

  useEffect(() => {
    if (user.uid && user.name) {
      const CURRENT_USER_KEY = DB_USERS_KEY + "/" + user.name.toLowerCase();
      const toptenRef = ref(database, CURRENT_USER_KEY + "/topten");
      const toptenorderRef = ref(database, CURRENT_USER_KEY + "/toptenorder");
      const wishlistRef = ref(database, CURRENT_USER_KEY + "/wishlist");
      const wishlistorderRef = ref(
        database,
        CURRENT_USER_KEY + "/wishlistorder"
      );
      onValue(toptenRef, (snapshot) => {
        const data = snapshot.val();
        setTopten(data);
      });
      onValue(toptenorderRef, (snapshot) => {
        const data = snapshot.val();
        setToptenorder(data);
      });
      onValue(wishlistRef, (snapshot) => {
        const data = snapshot.val();
        setWishlist(data);
      });
      onValue(wishlistorderRef, (snapshot) => {
        const data = snapshot.val();
        setWishlistorder(data);
      });
    }
  }, [user]);

  return (
    <NavContext.Provider value={{ navigate, handleNavigate }}>
      <UserContext.Provider value={{ user, setUser, DB_USERS_KEY }}>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={user.uid ? <Navigate to="/profile" /> : <SplashScreen />}
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route
              path="/explore"
              element={user.uid ? <ExploreScreen /> : <Navigate to="/" />}
            />
            <Route path="/profile">
              <Route
                index
                element={
                  user.uid ? (
                    <ProfileScreen
                      topten={topten}
                      toptenorder={toptenorder}
                      setToptenorder={setToptenorder}
                      wishlist={wishlist}
                      wishlistorder={wishlistorder}
                      setWishlistorder={setWishlistorder}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path=":link"
                element={
                  user.uid ? (
                    <PokeStatsScreen topten={topten} wishlist={wishlist} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Route>
            <Route
              path="/search-poke"
              element={
                user.uid ? (
                  <SearchPokeScreen DB_USERS_KEY={DB_USERS_KEY} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/search"
              element={
                user.uid ? (
                  <SearchUserScreen userList={userList} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </UserContext.Provider>
    </NavContext.Provider>
  );
};

export default App;
export { UserContext, NavContext };
