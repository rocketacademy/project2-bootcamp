import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useContext, createContext } from "react";

const authContext = createContext();

////////////////////////////////
//Component: Auth: Google login authentication
////////////////////////////////

// react hook to handle user authentication
export const useAuth = () => {
  return useContext(authContext);
};

// google auth, will open popup window to choose google account

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const Auth = ({ children }) => {
  // create state for the current user and pass to other components
  const [currentUser, setCurrentUser] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: "",
  });

  // show error message
  const [alert, setAlert] = useState({
    isAlert: false,
    severity: "info",
    message: "",
    timeout: null,
    location: "",
  });

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // listener for any change in user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    signUp,
    login,
    logout,
    modal,
    setModal,
    loginWithGoogle,
    alert,
    setAlert,
  };

  // authContext.Provider push the value properties to children
  return <authContext.Provider {...{ value }}>{children}</authContext.Provider>;
};

export default Auth;
