import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
export default function App() {
  const [user, setUser] = useState("");
  const navi = useNavigate();

  //useEffect to setUser
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setUser(user);
      }
    });
  });

  const userDisplay = (
    <div>
      <NaviBar />
      <div className="App">
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
  console.log(user);
  return user ? userDisplay : nonUserDisplay;
}
