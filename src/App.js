import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
export default function App() {
  const [user, setUser] = useState(null);
  const navi = useNavigate();
  const path = useLocation();
  //useEffect to setUser
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      setUser(user);
    });
  });

  const userDisplay = (
    <div>
      {path.pathname !== "/quiz" && <NaviBar />}
      <div className="outlet">
        <Outlet context={[user, setUser]} />
      </div>
    </div>
  );

  //Display for User haven't login
  const nonUserDisplay = (
    <div className="App">
      <h1>Flashcard</h1>
      <h2>Spanish-English</h2>
      <button onClick={() => navi("/register")}>Register</button>
      <button onClick={() => navi("/signin")}>Sign in</button>
    </div>
  );

  return user ? userDisplay : nonUserDisplay;
}
