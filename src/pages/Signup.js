import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { TextboxWithLabels } from "../components/Textbox";
import { AlertError } from "../components/Alerts";
import RadioButtons from "../components/RadioButtons";
import { signOut } from "firebase/auth";
import Buttons from "../components/Buttons";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("Teacher");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: username,
        });
        set(ref(db, `${selectedRadio}/${user.uid}`), {
          uid: user.uid,
          username: username,
          email: email,
          role: selectedRadio,
        });
        signOut(auth);
        navigate("/");
      })
      .catch((error) => {
        setShowErrorAlert(true);
        if (error.code === "auth/email-already-in-use") {
          setMessage(`Email addresss already in use.`);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        } else if (error.code === "auth/weak-password") {
          setMessage(`Password has to be at least 6 characters.`);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        }
      });
  };
  return (
    <>
      <div className="prose max-w-sm m-auto my-12">
        <h2 className="text-center">LEARNING MANAGEMENT PLATFORM</h2>
        <div className="pr-12 pl-6 py-4 mt-8 border-4 border  rounded-lg ">
          <form onSubmit={handleSignUp}>
            <p className="text-xl font-bold">Create an Account</p>
            {showErrorAlert && (
              <AlertError alertText={`Login failed. ${message}`} />
            )}
            <TextboxWithLabels
              id="username"
              label={"Username"}
              type={"text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={"required"}
            />
            <TextboxWithLabels
              id="email"
              label={"Email"}
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={"required"}
            />
            <TextboxWithLabels
              id="password"
              label={"Password"}
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={"required"}
            />
            <div className="flex m-6 justify-around">
              <RadioButtons
                id="teacher-radio"
                value="Teacher"
                label="Teacher"
                checked={selectedRadio === "Teacher"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
              <RadioButtons
                id="student-radio"
                value="Student"
                label="Student"
                checked={selectedRadio === "Student"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </div>
            <Buttons label="SIGN UP" />
          </form>
          <p className="text-sm">
            Already a user?
            <button onClick={() => navigate("/")}>
              <span className="underline underline-offset-4 m-1">Sign in</span>
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
export default Signup;
