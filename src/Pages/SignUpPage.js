//-----------React-----------//

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//-----------Firebase-----------//

import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
//-----------Images-----------//

import profile from "../Images/upload.png";
import morty from "../Images/morty.png";

export default function SignUpPage() {
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setIsFilled(newName.trim() !== "");
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/onboarding" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-transparent">blank</p>
        </header>
        {signingUp ? (
          <>
            <img
              src={morty}
              alt="import profile"
              className="h-[8em] w-[8em] rounded-full"
            />
            <h1 className="m-3 text-[2em] font-bold">Join Paired Up</h1>
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
                createUserWithEmailAndPassword(auth, email, password).then(
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
              sign up instead
            </NavLink>
          </>
        ) : (
          <>
            <h1 className="m-3 text-[2em] font-bold">
              Upload your name and photo
            </h1>
            <label htmlFor="profile-picture" className="">
              <img
                src={profile}
                alt="import profile"
                className="h-[8em] rounded-full border-2 border-black p-2"
              />
            </label>

            <input
              type="file"
              id="profile-picture"
              accept="image/*" // Allow only image files to be selected
              style={{ display: "none" }} // Hide the input element
            />
            <br />
            <label>Your Name:</label>

            <input
              type="text"
              className="input m-3 "
              value={name}
              onChange={handleNameChange}
            ></input>
            <button
              className="btn disabled:text-slate-300"
              onClick={setSigningUp}
              disabled={!isFilled}
            >
              Next
            </button>
          </>
        )}
      </div>
    </>
  );
}
