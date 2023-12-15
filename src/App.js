import "./App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
export default function App() {
  const [user, setUser] = useState(null);
  const navi = useNavigate();

  //useEffect to setUser

  const haveUserDisplay = (
    <div>
      <NaviBar />
      <div className="App">
        <Outlet context={[user, setUser]} />
      </div>
    </div>
  );

  const noUserDisplay = (
    <div className="App">
      <h1>Flashcard</h1>
      <h2>Spanish-English</h2>
      <button onClick={() => navi("/register")}>Register</button>
      <button onClick={() => navi("/signin")}>Sign in</button>
    </div>
  );

  return user ? haveUserDisplay : noUserDisplay;
}
