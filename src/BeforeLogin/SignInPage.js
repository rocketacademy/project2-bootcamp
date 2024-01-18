import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrorPage from "../ErrorPage";

// need to add logic to Sign in with firebase auth
//After login into the auth, return to "/"
export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
        setErrorMessage(error.message.slice(10));
      });
  };
  const handleForgotPasswordClick = () => {
    navi("/reset-password");
  };
  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <Link to="/" className="homepage-button">
        <CloseIcon />
      </Link>
      <h2 className="mb-5">Welcome back! </h2>
      <div className="mb-3">
        <label className="form-label">
          Email:
          <input
            type="email"
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
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="button" className="btn btn-dark mb-4" onClick={logIn}>
        Log in
      </button>
      <h6 onClick={handleForgotPasswordClick}>Forgot your password?</h6>
    </div>
  );
}
