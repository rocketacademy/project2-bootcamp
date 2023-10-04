//-----------React-----------//

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//-----------Firebase-----------//

import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
//-----------Images-----------//

import profile from "../Images/upload.png";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
          <h1 className="m-3 text-[2em] font-bold">Welcome back</h1>
          <form>
            <label>Email:</label>
            <br />
            <input
              type="text"
              className="input"
              id="email"
              placeholder="morty-smith@adultswim.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <label>Password:</label>
            <br />

            <input
              type="password"
              className="input"
              id="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </form>
          <br />
          <button
            className="btn"
            onClick={async (e) => {
              e.preventDefault();
              signInWithEmailAndPassword(auth, email, password).then(
                (userInfo) => {
                  console.log(userInfo);
                  setPassword("");
                  setEmail("");
                },
              );
              navigate("/");
            }}
          >
            Signup
          </button>
          <NavLink to="/onboarding" className="m-3 text-slate-500">
            Forgot password?{" "}
          </NavLink>
        </>
      </div>
    </>
  );
}
