import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
export default function App() {
  const [user, setUser] = useState({ uid: "DxXFVzvVUqSLfTtHfVUrjmV2MPW2" });
  const navi = useNavigate();
  const path = useLocation();
  //useEffect to setUser

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
