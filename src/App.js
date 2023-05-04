//--------- Firebase ---------//

import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

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
  const [topten, setTopten] = useState(null);
  const [toptenorder, setToptenorder] = useState([]);
  const [wishlist, setWishlist] = useState(null);
  const [wishlistorder, setWishlistorder] = useState(null);

  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  useEffect(() => {
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
            <Route path="/profile">
              <Route
                index
                element={
                  <ProfileScreen
                    topten={topten}
                    toptenorder={toptenorder}
                    setToptenorder={setToptenorder}
                    wishlist={wishlist}
                    wishlistorder={wishlistorder}
                    setWishlistorder={setWishlistorder}
                    handleLogOut={handleLogOut}
                  />
                }
              />
              <Route
                path=":link"
                element={
                  <PokeStatsScreen topten={topten} wishlist={wishlist} />
                }
              />
            </Route>
            <Route
              path="/search-poke"
              element={<SearchPokeScreen DB_USERS_KEY={DB_USERS_KEY} />}
            />
          </Routes>
        </div>
      </UserContext.Provider>
    </NavContext.Provider>
  );
};

export default App;
export { UserContext, NavContext };
