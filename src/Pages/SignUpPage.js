//-----------React-----------//

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//-----------Firebase-----------//
import { storage } from "../firebase/firebase";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
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
  const [file, setFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setIsFilled(newName.trim() !== "");
  };

  const handleImageUpload = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      const fileRef = sRef(storage, `image/${file.name}`);
      uploadBytes(fileRef, file)
        .then(() => getDownloadURL(fileRef))
        // .then((url) => {
        //   // Add posts and final URL AFTER image URL is generated
        //   push(postListRef, {
        //     comment: comment,
        //     date: `${new Date()}`,
        //     image: url,
        //   });
        // })
        // Clear input fields
        .then((url) => {
          setProfilePicture(url);
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  }, [file]);

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
              src={profilePicture ? profilePicture : morty}
              alt="Profile"
              className="h-[8em] rounded-full border-2 border-black p-1"
            />
            <h1 className="m-3 text-[2em] font-bold">Hello {name} </h1>
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
            <NavLink to="/sign-in" className="m-3 text-slate-500">
              sign in instead
            </NavLink>
          </>
        ) : (
          <>
            <h1 className="m-3 text-[2em] font-bold">
              Upload your name and photo
            </h1>
            <label htmlFor="profile-picture" className="">
              <img
                src={profilePicture ? profilePicture : profile}
                alt="Upload"
                className="h-[8em] rounded-full border-2 border-black p-1"
              />
            </label>

            <input
              type="file"
              id="profile-picture"
              accept="image/*" // Allow only image files to be selected
              style={{ display: "none" }} // Hide the input element
              onChange={handleImageUpload}
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
