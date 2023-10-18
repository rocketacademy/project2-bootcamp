//-----------React-----------//
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";

//-----------Components-----------//
import Button from "../Details/Button";
import Footer from "../Details/Footer";
import ProfileImage from "../Details/ProfileImage.js";
import NavBar from "../Details/NavBar";
import SignInReminder from "../Components/Helpers/SignInReminder.js";

//-----------Firebase-----------//
import { auth, database, storage } from "../firebase/firebase";
import { updateProfile, signOut } from "firebase/auth";
import { ref, child, set, onValue } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL,} from 'firebase/storage';

//-----------Images-----------//
import person1 from "../Images/LogosIcons/person1.png";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

export default function SettingsPage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [displayName, setDisplayName] = useState('')
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [tempPairKey, setTempPairKey] = useState("");
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [currentUserKey, setCurrentUserKey] = useState(null)

  const isLoggedIn = ContextHelper("isLoggedIn");
  const email = ContextHelper("email");
  const pairKey = ContextHelper("pairKey");
  const navigate = useNavigate();

  
  useEffect(() => { //pull profile pic when component mounts
    const userRef = ref(database, `userRef`); //setup reference
    onValue(userRef, (data)=> {
      const val = data.val();
      const userKeyArray = Object.keys(val).filter((key)=>val[key].email === email)
      if (userKeyArray.length !== 1) { //error out if no users/multiple user emails found matching current user email in context
        console.log(`error: found ${userKeyArray.length} users matching current user email`)
        return
      }
      setCurrentUserKey(userKeyArray[0])
      setProfilePictureURL(val[userKeyArray[0]].profilePicture)
      }) 
  }, []);

  //Update start date of relationship in room
  
  const updateProfilePic = (e) => {
    if (!profilePicture) {
      return;
    }
    console.log('updating profile pic')
    const fileRef = sRef(storage,`userRef/${email}/profilePic`)
    uploadBytes(fileRef, profilePicture)
    .then(() => getDownloadURL(fileRef))
    .then((url) => {
      const profilePicRef = ref(database, `userRef/${currentUserKey}/profilePicture` );
      return Promise.all([
        set(profilePicRef, url),
        updateProfile(auth.currentUser, {photoURL:url})
      ])
    })
  }

  const updateDisplayName =(e) => {
    if (!displayName) {
      return;
    }
    console.log('updating display name')
    const displayNameRef = ref(database, `userRef/${currentUserKey}/displayName`);
    Promise.all([
    set(displayNameRef, displayName),
    updateProfile(auth.currentUser, {displayName:displayName})
  ])
    .then(()=>{
      console.log('setting')
      setDisplayName('')
    })
  }

  const updateBackgroundPicture = (e) => {
    if(!backgroundPicture) {
      return;
    }
    console.log('updating background pic')
    const fileRef = sRef(storage,`rooms/${pairKey}/backgroundImage`)
    uploadBytes(fileRef, backgroundPicture)
    .then(() => getDownloadURL(fileRef))
    .then((url) => {
      const backgroundPicRef = ref(database, `rooms/${pairKey}/backgroundImage`);
        set(backgroundPicRef, {
            backgroundImageURL: url,
        })
    })
    .then(() => {
      //reset form after submit
      setBackgroundPicture(null);
    });
  }

  const updateStartDate = () => {
    if(!startDate) {
      return;
    }
    console.log('updating start date')
    if (pairKey) {
      const roomRef = ref(database, `rooms/${pairKey}`);
      const dateRef = child(roomRef, "startDate");

      set(dateRef, startDate)
        .then(() => {
          console.log("Start date updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating start date:", error);
        });
    }
  };

  const handleUserDetailUpdate = (e)=>{
    updateProfilePic()
    updateDisplayName()
    updateBackgroundPicture()
    updateStartDate()
  }

  // Toggle sign out + navigate back to onboarding
  const context = useContext(UserContext);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed Out");
        navigate("/onboarding");
        context.setPairKey("");
        context.setEmail("");
        context.setDisplayName("");
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
    {console.log(auth.currentUser)}
      <NavBar label="Settings" />
      {isLoggedIn ? (
        <main className="flex flex-col items-center">
          <form className="mb-2 flex w-3/4 flex-col items-center">       
            <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
              <ProfileImage
                src={profilePictureURL ? profilePictureURL : person1}
                alt="Profile photo"
              />
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*" // Allow only image files to be selected
              style={{ display: "none" }} // Hide the input element
              onChange={(e) => {
                console.log(e.target.files)
                setProfilePicture((e.target.files[0]))
                setProfilePictureURL(URL.createObjectURL(e.target.files[0]))
                ;}}
            />
            <label>Display Name:</label>
            <input
              type="text"
              className=" mb-1 w-[14em] rounded-md border-[1px] border-black px-2"
              id="displayName"
              value={displayName}
              placeholder=""
              onChange={(e) => {setDisplayName((e.target.value));}}
            />
            <label>Background Photo:</label>
            <input
              type="file"
              className="mb-1 w-[14em] rounded-md border-[1px] border-black bg-white px-2"
              id="background photo"
              placeholder="Insert file"
              onChange={(e) => {setBackgroundPicture((e.target.files[0]));}}
            />
            <label>Start of relationship:</label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className="mb-1 w-[14em] rounded-md border-[1px] border-black px-2"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </form>
          <Button label="✏️Update Details" handleClick={handleUserDetailUpdate} />
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
                , all images, chats and data for both users will be erased.
                Enter your pair key below to delete your pair.
              </p>
              <p className="py-2">Your Pair Key: {pairKey}</p>
              <form>
                <input
                  className="input"
                  value={tempPairKey}
                  onChange={(e) => setTempPairKey(e.target.value)}
                ></input>
                <button
                  className="btn ml-2 bg-red-700 text-white hover:bg-red-900 disabled:text-slate-300"
                  disabled={!(tempPairKey === pairKey)}
                  onClick={deletePairKey}
                >
                  Confirm
                </button>
              </form>
            </div>
          </dialog>
        </main>
      ) : (
        <SignInReminder />
      )}
      <Footer />
    </div>
  );
}
