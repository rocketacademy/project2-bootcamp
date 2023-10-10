//-----------React-----------//
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App.js";
//-----------Firebase-----------//
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
//-----------Images-----------//
import profile from "../Images/upload.png";
import SignInForm from "../Components/Onboarding/SignInForm.js";

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
      console.log(userInfo);
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

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        console.log(userInfo);
        // signed in user
        context.setIsLoggedIn(true);
      } else {
        // no signed-in user
        context.setIsLoggedIn(false);
      }
    });
  }, [context]);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <>
          <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
            <NavLink to="/onboarding" className="text-[2em]">
              ←
            </NavLink>
            <p className="text-transparent">blank</p>
          </header>
          <img
            src={profile}
            alt="import profile"
            className="h-[8em] rounded-full border-2 border-black p-2"
          />
          <h1 className="m-3 text-[2em] font-bold">
            Welcome back [displayName]
          </h1>

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
      </div>
    </>
  );
}
