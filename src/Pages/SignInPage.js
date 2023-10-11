//-----------React-----------//
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App.js";
//-----------Components-----------//
import SignInForm from "../Components/Onboarding/SignInForm.js";
import NavBar from "../Details/NavBar.js";
import Footer from "../Details/Footer.js";
//-----------Firebase-----------//
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
//-----------Images-----------//
import person2 from "../Images/LogosIcons/person2.png";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const context = useContext(UserContext);

  const signIn = async () => {
    try {
      const userInfo = await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      // setUser(userInfo);
      if (userInfo) {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const resetPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
    sendPasswordResetEmail(auth, email)
      .then((response) => {
        console.log("email sent");
        console.log("email response?", response);
        setMessage(`Reset password email has been sent to ${email}`);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <>
          <NavBar nav="/onboarding" />
          <img
            src={person2}
            alt="import profile"
            className="h-[8em] w-[8em] rounded-full border-2 border-black bg-white object-contain p-1"
          />
          <h1 className="m-3 text-[2em] font-bold">Welcome back!</h1>

          <SignInForm
            signIn={signIn}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            resetPassword={resetPassword}
            errorMessage={errorMessage}
          />
          {message && message}
        </>
        <Footer />
      </div>
    </>
  );
}
