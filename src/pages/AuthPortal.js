import { useState, useEffect } from "react";
import "./AuthPortal.css";
import AuthForm from "../components/AuthPortal/AuthForm";
import { auth } from "../firebase";
import logo from "../logo.png";
import Navbar from "../components/Navbar";

const AuthPortal = () => {
  const [showAuthForm, setShowAuthForm] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {});
    return () => {
      unsubscribe();
    };
  });

  const toggleAuthForm = () => {
    setShowAuthForm(!showAuthForm);
  };

  return (
    <div className="App">
      {auth.currentUser ? <Navbar /> : null}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        {auth.currentUser ? (
          <h1>
            Welcome
            {auth.currentUser.displayName && " " + auth.currentUser.displayName}
            !
          </h1>
        ) : null}
        <br />
        {auth.currentUser ? null : <AuthForm toggleAuthForm={toggleAuthForm} />}
      </header>
    </div>
  );
};

export default AuthPortal;
