import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextboxWithLabels } from "../components/Textbox";
import { AlertSuccess } from "../components/Alerts";
import Buttons from "../components/Buttons";
const Reset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email).then(() => {
      setMessage("Password link sent!");
      setEmail("");
      setShowSuccessAlert(true);
    });
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };
  return (
    <>
      <div className="prose max-w-sm m-auto my-12">
        <h2 className="text-center">LEARNING MANAGEMENT PLATFORM</h2>
        <div className="pr-12 pl-6 py-4 mt-8 border-4 rounded-lg ">
          <form onSubmit={handleReset}>
            <p>
              <b>Trouble signing in?</b>
            </p>
            <p className="text-sm font-bold">
              Enter your email address and we will send you a link to log back
              in.
            </p>
            {showSuccessAlert && <AlertSuccess alertText={message} />}
            <TextboxWithLabels
              label={"Email"}
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={"required"}
            />
            <div className="mt-6">
              <Buttons label="Send Reset Password Link" />
            </div>
          </form>
          <p className="text-sm">
            <button onClick={() => navigate("/")}>
              <span className="underline underline-offset-4 m-1">
                Back to Login
              </span>
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
export default Reset;
