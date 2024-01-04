import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import "bootstrap/dist/css/bootstrap.css";

// need to add logic to Register with firebase auth
//After register into the auth, return to "/"
export default function RegisterPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const navi = useNavigate();
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password, name);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setEmail("");
      setPassword("");
      setName("");
      navi("/");
    } catch (error) {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="App">
      <h2 className="mb-5">Hi, nice to meet you!</h2>
      <div className="mb-3">
        <label className="form-label">
          Name or nickname:
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Brian"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Email:
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="brian123@brian.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Password:
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="button" className="btn btn-dark mb-4" onClick={register}>
        Register
      </button>

      <div className="errorMessage">
        {errorCode ? <h4>Oops! Something went wrong! </h4> : null}
        <h6>{errorCode}</h6>
      </div>
    </div>
  );
}
