import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email).then(() => {
      setMsg("Password link sent!");
      setEmail("");
    });
  };
  return (
    <>
      <p className="font-bold tracking-wider">
        LEARNING
        <br />
        MANAGEMENT
        <br />
        PLATFORM
      </p>
      <div className="px-6 py-12 mt-6 bg-amber-50 rounded-lg">
        <form onSubmit={handleReset}>
          <p className="text-sm text-center mb-4 font-bold">
            Trouble signing in?
          </p>
          <p className="text-sm mb-2">{msg && msg}</p>
          <p class="text-sm mb-4 text-wrap">
            Enter your email address and we will send you a link to log back in.
          </p>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered dark:bg-white mb-2 dark:border-gray-600"
          />

          <div>
            <button
              type="submit"
              className="font-bold shadow-lg border text-sm rounded-lg  p-2.5 dark:bg-red-100 dark:border-gray-600 mb-6"
            >
              Send Reset Password Link
            </button>
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
    </>
  );
};

export default Reset;
