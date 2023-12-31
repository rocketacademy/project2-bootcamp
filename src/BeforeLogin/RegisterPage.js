import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

// need to add logic to Register with firebase auth
//After register into the auth, return to "/"
export default function RegisterPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();
  const register = async () => {
    await createUserWithEmailAndPassword(auth, email, password, name)
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

  return (
    <div className="App">
      <label>
        Name or nickname:
        <input
          type="text"
          name="name"
          placeholder="Enter your name or nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </label>
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
      <button onClick={register}>Register</button>

      <div className="errorMessage">
        <p>{errorCode && `Error code: ${errorCode}`}</p>
        <p>{errorMessage && `Error message: ${errorMessage}`}</p>
      </div>
    </div>
  );
}
