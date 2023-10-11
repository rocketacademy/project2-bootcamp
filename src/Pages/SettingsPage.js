//-----------React-----------//
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//-----------Components-----------//
import Button from "../Details/Button";
import Footer from "../Details/Footer";
import ProfileImage from "../Details/ProfileImage.js";
import NavBar from "../Details/NavBar";

//-----------Firebase-----------//
import { auth } from "../firebase/firebase";
import { updateProfile, signOut } from "firebase/auth";

//-----------Images-----------//
import person1 from "../Images/LogosIcons/person1.png";

export default function SettingsPage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [file, setFile] = useState(null);

  const [pairKey, setPairKey] = useState("");
  const [tempPairKey] = useState("Example123"); //temp pair key till able to import from database

  const navigate = useNavigate();

  const authUpdate = () => {
    updateProfile(auth.currentUser, {
      pairKey: "wumbo",
      phoneNumber: 1234,
      displayName: "phone",
    })
      .then(() => {
        console.log("Pairkey up");
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      user.providerData.forEach((profile) => {
        console.log("Sign-in provider: " + profile.pairKey);
        console.log(" PhoneNumber " + profile.phoneNumber);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }
  }, []);

  // Toggle sign out + navigate back to onboarding
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed Out");
        navigate("/onboarding");
      })
      .catch((error) => {
        console.log("Error Signing Out");
      });
  };

  // Wipe pair account -> Delete all couple data + navigate back to onboarding
  const deletePairKey = () => {
    console.log("Account deleted");
    //delete user files
    //sign out user
    //set global state back to isSignedIn (false) + isPaired (false)
    navigate("/onboarding");
  };

  return (
    <div className=" flex h-screen flex-col items-center justify-center bg-background">
      <NavBar label="Settings" />
      <Button label="write auth" handleClick={authUpdate} />
      <main className="flex flex-col items-center">
        <form className="mb-2 flex w-3/4 flex-col items-center">
          <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
            <ProfileImage
              src={profilePicture ? profilePicture : person1}
              alt="Profile photo"
            />
          </label>
          <input
            type="file"
            id="profile-picture"
            accept="image/*" // Allow only image files to be selected
            style={{ display: "none" }} // Hide the input element
            onChange={handleImageUpload}
          />
          <label>Display Name:</label>
          <input
            type="text"
            className=" input mb-1 w-full bg-white"
            id="displayName"
            placeholder=""
          />
          <label>Background Photo:</label>

          <input
            type="file"
            className="file-input mb-1 w-full bg-white"
            id="background photo"
            placeholder="Insert file"
          />
          <label>Start of relationship:</label>
          <input
            type="date"
            className="input w-full bg-white"
            id="background photo"
            placeholder="Insert file"
          />
        </form>
        <Button label="🗓️ Link Calendar" />
        <Button label="🌴 Sign Out" handleClick={handleSignOut} />
        <Button
          label="❌ Delete Pair"
          handleClick={() =>
            document.getElementById("delete_modal").showModal()
          }
        />
        <dialog id="delete_modal" className="modal ">
          <div className="modal-box bg-slate-100">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">
              Are you sure you want to delete your pair?
            </h3>
            <p className="py-2">
              This operation
              <span className="font-bold text-red-600">
                {" "}
                cannot be reversed
              </span>
              , all images, chats and data for both users will be erased. Enter
              your pair key below to delete your pair.
            </p>
            <p className="py-2">Your Pair Key: {tempPairKey}</p>
            <form>
              <input
                className="input"
                value={pairKey}
                onChange={(e) => setPairKey(e.target.value)}
              ></input>
              <button
                className="btn ml-2 bg-red-700 text-white hover:bg-red-900 disabled:text-slate-300"
                disabled={!(pairKey === tempPairKey)}
                onClick={deletePairKey}
              >
                Confirm
              </button>
            </form>
          </div>
        </dialog>
      </main>
      <Footer />
    </div>
  );
}
