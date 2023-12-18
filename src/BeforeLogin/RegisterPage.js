import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";

// need to add logic to Register with firebase auth
//After register into the auth, return to "/"
export default function RegisterPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState("");
  const navi = useNavigate();
  const register = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
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
        console.log(user);
      }
    });
  });

  return (
    <div className="App">
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        type="text"
        name="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={register}>Register</button>

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
