import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useState, useEffect } from "react";

// need to add logic to Sign in with firebase auth
//After login into the auth, return to "/"
export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState("");
  const navi = useNavigate();
  const logIn = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        setEmail("");
        setPassword("");
        setName("");
        navi("/");
      })
      .catch((error) => {
        setErrorCode(error.code);
        setErrorMessage(error.message);
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setUser(user);
        // console.log(user);
      }
    });
  });
  return (
    <div className="App">
      <label>
        Email:
        <input
          type="text"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </label>
      <label>
        Password:
        <input
          type="text"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </label>
      <button onClick={logIn}>Log in</button>

      <div className="errorMessage">
        <p>{errorCode && `Error code: ${errorCode}`}</p>
        <p>{errorMessage && `Error message: ${errorMessage}`}</p>
      </div>
      <div className="currUser">
        {user ? <span> Logged in user: {user.email} </span> : null}
      </div>
    </div>
  );
}
