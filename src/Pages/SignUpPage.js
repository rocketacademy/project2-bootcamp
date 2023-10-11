//-----------React-----------//
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { UserContext } from "../App.js";
//-----------Components-----------//
import SignUpForm from "../Components/Onboarding/SignUpForm.js";
import Button from "../Details/Button";
import NavBar from "../Details/NavBar.js";
import Footer from "../Details/Footer.js";
import ProfileImage from "../Details/ProfileImage.js";

//-----------Firebase-----------//
import { storage, auth } from "../firebase/firebase";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  // onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
//-----------Media-----------//
import person1 from "../Images/LogosIcons/person1.png";

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
    <div className=" flex h-screen flex-col items-center justify-center bg-background">
      <NavBar label="Sign Up" nav="/onboarding" />
      {/* Sign Up form */}
      {signingUp ? (
        <>
          <ProfileImage
            src={profilePicture ? profilePicture : person1}
            alt="Profile photo"
          />
          <h1 className="m-3 text-[1.5em] font-bold">Hello {displayName}!</h1>
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
          {/* Upload photo and name */}
          <h1 className="m-3 p-2 text-center text-[1.5em] font-bold">
            Upload a photo and tell me your name!
          </h1>
          <form className="flex flex-col items-center">
            <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
              <ProfileImage
                src={profilePicture ? profilePicture : person1}
                alt="Profile photo"
              />
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label className="mt-1">Your Name:</label>
            <input
              type="text"
              className="input m-2 bg-white"
              value={displayName}
              onChange={handleNameChange}
            ></input>
          </form>
          <Button
            label="Next"
            handleClick={setSigningUp}
            disabled={!isFilled}
          />
        </>
      )}
      <Footer />
    </div>
  );
}
