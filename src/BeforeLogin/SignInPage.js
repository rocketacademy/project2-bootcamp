import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
// need to add logic to Sign in with firebase auth
//After login into the auth, return to "/"
export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
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
        console.log(auth.currentUser.displayName);
      })
      .catch((error) => {
        setErrorCode(error.code);
      });
  };

  return (
    <div className="App">
      <h2 className="mb-5">Welcome back! </h2>
      <div className="mb-3">
        <label className="form-label">
          Email:
          <input
            type="email"
            class="form-control"
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
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="button" className="btn btn-dark mb-4" onClick={logIn}>
        Log in
      </button>

      <div className="errorMessage">
        {errorCode ? <h4>Oops! Something went wrong! </h4> : null}
        <h6>{errorCode}</h6>
      </div>
    </div>
  );
}
