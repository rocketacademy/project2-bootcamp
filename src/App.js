import React from "react";
import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//routes
import AdminUpload from "./components/AdminUpload";
import Home from "./components/Home";
import SignIn from "./components/LoginDefault";
import SignUp from "./components/SignUpAccount";
import Auth from "./components/Auth";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const App = () => {
  const auth = getAuth();
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Triggered");
      if (user) {
        console.log(`User Registered: ${user}`);
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Auth>
        <div className="App">
          <ResponsiveAppBar signOut={signOut} />
          <div>
            <Routes>
              <Route
                path="/"
                element={auth.currentUser ? <Home /> : <SignIn />}
              />
              <Route exact path="/admin" element={<AdminUpload />} />
              <Route exact path="/login" element={<SignIn />} />
              <Route exact path="/signup" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </Auth>
    </BrowserRouter>
  );
};

export default App;
