import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NaviBar from "./AfterLogin/NaviBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isBrowser } from "react-device-detect";
import { Button } from "@mui/material";
import logo from "./img/logo.jpg";

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
      {path.pathname.substring(0, 5) !== "/quiz" && (
        <NaviBar user={user} setUser={setUser} />
      )}
      <div className="outlet">
        <Outlet context={[user, setUser]} />
      </div>
    </div>
  );

  //Display for User haven't login
  const nonUserDisplay = (
    <div className="App">
      <img src={logo} alt="logo" className="logo" />
      <div className="front-page-button">
        <Button variant="contained" onClick={() => navi("/register")}>
          Register
        </Button>
        <Button variant="contained" onClick={() => navi("/signin")}>
          Sign in
        </Button>
      </div>
    </div>
  );

  return user ? (
    <DndProvider backend={isBrowser ? HTML5Backend : TouchBackend}>
      {userDisplay}
    </DndProvider>
  ) : (
    nonUserDisplay
  );
}
