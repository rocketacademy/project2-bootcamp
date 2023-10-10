//-----------React-----------//
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { UserContext } from "../App.js";

//-----------Firebase-----------//
import { storage, auth } from "../firebase/firebase";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  // onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
//-----------Images-----------//

import person1 from "../Images/LogosIcons/person1.png";
import SignUpForm from "../Components/Onboarding/SignUpForm.js";
import Button from "../Details/Button";

export default function SignUpPage() {
  const [isFilled, setIsFilled] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    let newName = e.target.value;
    setDisplayName(newName);
    setIsFilled(newName.trim() !== "");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const signUp = async () => {
    try {
      const userInfo = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userInfo) {
        // Update user profile information
        await updateProfile(userInfo.user, {
          displayName: displayName,
          photoURL: profilePicture,
        });

        console.log("User Profile Updated");
        setEmail("");
        setPassword("");
        navigate("/pair-up");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (file) {
      const fileRef = sRef(storage, `image/${file.name}`);
      uploadBytes(fileRef, file)
        .then(() => getDownloadURL(fileRef))
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
      <div className=" flex h-screen flex-col items-center justify-center bg-background">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/onboarding" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-[2em]">Sign Up</p>
          <p className="text-transparent">blank</p>
        </header>
        {signingUp ? (
          <>
            <img
              src={profilePicture ? profilePicture : person1}
              alt="Profile"
              className="h-[8em] w-[8em] rounded-full border-2 border-black bg-white object-contain p-1"
            />
            <h1 className="m-3 text-[2em] font-bold">Hello {displayName}!</h1>
            <SignUpForm
              signUp={signUp}
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              errorMessage={errorMessage}
            />
          </>
        ) : (
          <>
            <h1 className="m-3 text-[2em] font-bold">
              Upload your name and photo
            </h1>
            <label htmlFor="profile-picture" className="">
              <img
                src={profilePicture ? profilePicture : person1}
                alt="Upload"
                className="h-[8em] w-[8em] rounded-full border-2 border-black bg-white object-contain p-1 hover:translate-y-[-2px]"
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
              className="input m-3 bg-white"
              value={displayName}
              onChange={handleNameChange}
            ></input>
            <Button
              label="Next"
              handleClick={setSigningUp}
              disabled={!isFilled}
            />
          </>
        )}
      </div>
    </>
  );
}
