import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.css";
import ErrorPage from "../ErrorPage";

export default function ResetPasswordPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const navi = useNavigate();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("email sent, password reset");
      setEmail("");
      navi("/signin");
    } catch (error) {
      setErrorMessage(error.message.slice(10));
    }
  };

  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={() => setErrorMessage("")}
      />
      <h5>
        Type in your email you registered with, a link to reset your password
        will be sent to you:
      </h5>
      <div className="mb-3">
        <label className="form-label">
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
      <button
        type="button"
        className="btn btn-dark mb-4"
        onClick={resetPassword}
      >
        Reset password
      </button>
    </div>
  );
}
