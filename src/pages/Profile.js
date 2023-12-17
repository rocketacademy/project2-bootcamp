import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import ItemCard from "../components/itemCard";

import { auth, database, storage } from "../firebase.js";
import { UserContext } from "../App.js";

import {
  ref,
  set,
  push,
  onChildAdded,
  onChildRemoved,
  onValue,
} from "firebase/database";

import { 
    ref as sRef, 
    uploadBytes, 
    getDownloadURL,
} from "firebase/storage";

import { 
  signOut,
  updateProfile,
} from "firebase/auth";

/////////// DECALRE FIREBASE LIST NAME HERE ///////////
const STORAGE_KEY = "profilepic";
const DB_HIDDENGEM_KEY = "hiddengems";
const DB_HIDDENGEM_SELF_ADDON_DATA_KEY = "hiddengems-selfaddondata";

const Profile = (props) => {
  // User Object brought in via useContext();
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  /////////// DECALRE STATES HERE ///////////
  const [ profilePic, setProfilePic ] = useState(null);
  const [ uploadedPicToChange, setUploadedPicToChange ] = useState(null);
  const [ fileInputValue, setFileInputValue ] = useState("");
  const [ imagePreviewURL, setImagePreviewURL ] = useState("");
  const [ hiddenGem, setHiddenGem ] = useState({});
  const [ hiddenGemSelfAddOnData, setHiddenGemSelfAddOnData] = useState({});
  const [ visitedPlace, setVisitedPlace ] = useState(null);
  const [ savedPlace, setSavedPlace ] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Upload image into storage and get the image url
    const fileRef = sRef(storage, `${STORAGE_KEY}/${user.uid}/${uploadedPicToChange.name}`);
    uploadBytes(fileRef, uploadedPicToChange)
      .then(() => {
        // Get Image URL
        return getDownloadURL(fileRef);
      })
      .then((url) => {
        console.log("url:", url);
        // Pushing up profile photo url into realtime database.
        updateProfile(auth.currentUser, {
          photoURL: url,
        });
        setProfilePic(url);
      })
      .then(() => {
        setUploadedPicToChange(null);
        setImagePreviewURL("");
      });
    // Need to put turn off "Modal" code here? 
    document.getElementById("change_profile_pic_modal").close();

  };

  const logOut = () => {
    signOut(auth)
    .then(() => {
      console.log("Signed Out");
      setUser({});
      setIsLoggedIn(false);
      navigate('/');
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const changePhotoButton = () => {
    return (
      <div>
        <label htmlFor="image_upload" className="text-sm cursor-pointer">
          Change Photo
        </label>
        <br />
        <input
          type="file"
          id="image_upload"
          accept="image/*"
          // Set state's fileInputValue to "" after submit to reset file input
          value={fileInputValue}
          onChange={(e) => fileChange(e)}
          style={{ opacity: 0 }}
        />
      </div>
    )
  };
  
  const fileChange = (e) => {
    // "e.target.files" gets all the information of the selected file
    console.log(e.target.files[0]);
    setUploadedPicToChange(e.target.files[0]);
    setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
  };

  const visitedPlaceRender = () => {
    if (visitedPlace && hiddenGem) {
      return visitedPlace.map((key) => {
        return (
          <ItemCard
            key={key}
            name={hiddenGem[key].name}
            overview={hiddenGem[key].editorial_summary ? hiddenGem[key].editorial_summary.overview : ""}
            photoURL={hiddenGemSelfAddOnData[key].photos[0]}
            lat={hiddenGem[key].geometry.location.lat}
            lng={hiddenGem[key].geometry.location.lng}
            place_id={key}
          />
        )
      })
    }
  };

  const savedPlaceRender = () => {
    if (savedPlace && hiddenGem) {
      return savedPlace.map((key) => {
        return (
          <ItemCard
            key={key}
            name={hiddenGem[key].name}
            overview={hiddenGem[key].editorial_summary ? hiddenGem[key].editorial_summary.overview : ""}
            photoURL={hiddenGemSelfAddOnData[key].photos[0]}
            lat={hiddenGem[key].geometry.location.lat}
            lng={hiddenGem[key].geometry.location.lng}
            place_id={key}
          />
        )
      })
    }
  }

  const profilePicRender = () => {
    return (
      <img
        alt="profile_pic"
        src={
          profilePic
            ? profilePic
            : `https://firebasestorage.googleapis.com/v0/b/globalgems-e353b.appspot.com/o/profile_pic.jpg?alt=media&token=0ddff376-b175-4835-8d1c-02867db1a397&_gl=1*1uc9vza*_ga*MTI5Mzg0Nzk2Mi4xNjk3NjE2NTA2*_ga_CW55HF8NVT*MTY5NzYxNjUwNi4xLjEuMTY5NzYxNzMzNy41NS4wLjA.`
        }
      />
    );
  }

  useEffect(() => {
    const dbRefForHiddenGem = ref(database, DB_HIDDENGEM_KEY)
    const dbRefForHiddenGemSelfAddOnData = ref(database, DB_HIDDENGEM_SELF_ADDON_DATA_KEY)
    
    onChildAdded(dbRefForHiddenGem, (data) => {
      setHiddenGem(hiddengem => {
        return {
          ...hiddengem,
          [data.key]: {...data.val()},
        }
      });
    });

    onChildAdded(dbRefForHiddenGemSelfAddOnData, (data) => {
      setHiddenGemSelfAddOnData(hiddengemAddOnData => {
        return {
          ...hiddengemAddOnData,
          [data.key]: {...data.val()},
        }
      });
    });

    setProfilePic(user.photoURL);
  }, []);

  //Handles "visited" and "saved" place info
  useEffect(() => {
    let visitedPlaceId = [];
    let savedPlaceId = [];
    //Validate hiddenGemSelfAddOnData
    if (hiddenGemSelfAddOnData) {
      const itemKeysArr = Object.keys(hiddenGemSelfAddOnData);
      itemKeysArr.forEach((itemKey) => {

        //Handle visits
        if (hiddenGemSelfAddOnData[itemKey].visits) {
          if (hiddenGemSelfAddOnData[itemKey].visits[user.uid]) {
            if (hiddenGemSelfAddOnData[itemKey].visits[user.uid] === true) {
              visitedPlaceId.push(itemKey);
            };
          }
        };

        //Handle saves
        if (hiddenGemSelfAddOnData[itemKey].saves) {
          if (hiddenGemSelfAddOnData[itemKey].saves[user.uid]) {
            if (hiddenGemSelfAddOnData[itemKey].saves[user.uid] === true) {
              savedPlaceId.push(itemKey);
            };
          }
        };

      });
      setVisitedPlace(visitedPlaceId);
      setSavedPlace(savedPlaceId);
    }
  },[hiddenGemSelfAddOnData])

  useEffect(() => {
    if (profilePic) {
      profilePicRender();
    }
  },[profilePic])

  return (
    <div className="App">
      <Header />
      <div 
        className="flex h-screen justify-center text-center content-center overflow-auto gap-6 p-14"
        style={{ height: "calc(100% - 64px)" }}
      >
        <div className="avatar flex flex-col">
          <div className=" w-24 h-24 rounded-full">
            {profilePicRender()}
          </div>
          <button
            className="btn btn-xs btn-link text-xs p-2"
            onClick={() => {
              document.getElementById("change_profile_pic_modal").showModal();
              }
            }
          >
            Change Pic
          </button>
        </div>

        <div className="flex flex-col justify-around gap-3">
          <div>
            <p>
              Username: <span className="font-bold">{user.displayName}</span>
            </p>
            <p>
              Email: <span className="font-bold">{user.email}</span>
            </p>
          </div>
          <button className="btn btn-sm" onClick={logOut}>
            Logout
          </button>
        </div>
      </div>
    
      <div className="flex justify-center text-center content-center gap-4">
          {/* Visited Button */}
          <button 
            type="button" 
            className="btn text-lg flex justify-between text-center content-center gap-2"
            onClick={() =>
              document.getElementById("visited_place_modal").showModal()
            }
          >
            <i className="fi fi-sr-check-circle flex justify-center text-center content-center"></i>
            <span className=" text-base">Visited</span>
          </button>
          {/* Saved Button */}
          <button 
            type="button" 
            className="btn text-lg flex justify-between text-center content-center gap-2"
            onClick={() =>
              document.getElementById("saved_place_modal").showModal()
            }
          >
            <i className="fi fi-sr-bookmark flex justify-center text-center content-center"></i>
            <span className=" text-base">Saved</span>
          </button>
      </div>

      {/* Model for Visited Place */}
      <dialog id="visited_place_modal" className="modal">
        <div className="modal-box flex flex-col justify-center text-center content-center pb-0 px-3">
          <form method="dialog" className="fixed top-0 left-0 w-full bg-white p-4 z-10">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="relative">
            <h3 className="font-bold text-base text-center my-2">Visited Place</h3>
            <hr />
          </div>
          <div className="overflow-y-auto p-4">
            {visitedPlaceRender()}
          </div>
        </div>
      </dialog>

      {/* Model for Saved Place */}
      <dialog id="saved_place_modal" className="modal">
        <div className="modal-box flex flex-col justify-center text-center content-center pb-0 px-3">
          <form method="dialog" className="fixed top-0 left-0 w-full bg-white p-4 z-10">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="relative">
            <h3 className="font-bold text-base text-center my-2">Saved Place</h3>
            <hr />
          </div>
          <div className="overflow-y-auto p-4">
            {savedPlaceRender()}
          </div>
        </div>
      </dialog>
      
      {/* Model for Profile Picture */}
      <dialog id="change_profile_pic_modal" className="modal">
        <div className="modal-box flex flex-col justify-center text-center content-center">
          <form method="dialog" >
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Change Profile Photo</h3>
          <form onSubmit={(e) => handleSubmit(e)} className="m-5">
            {imagePreviewURL ? (
              <div>
                <div className="avatar">
                  <div className=" w-40 h-40 rounded-full">
                    <img src={imagePreviewURL} alt="previewPhoto" />
                  </div>
                </div>
                <br />
                {changePhotoButton()}
              </div>
              ) : (
                  profilePic ? (
                  <div>
                    <div className="avatar">
                      <div className=" w-40 h-40 rounded-full">
                        <img src={profilePic} alt="uploadedPhoto" />
                      </div>
                    </div>
                    <br />
                    {changePhotoButton()}
                  </div>
                ) : (
                  <div>
                    <div className="avatar">
                      <div className="w-40 h-40 rounded-full">
                        <img 
                          src="https://firebasestorage.googleapis.com/v0/b/globalgems-e353b.appspot.com/o/profile_pic.jpg?alt=media&token=0ddff376-b175-4835-8d1c-02867db1a397&_gl=1*1uc9vza*_ga*MTI5Mzg0Nzk2Mi4xNjk3NjE2NTA2*_ga_CW55HF8NVT*MTY5NzYxNjUwNi4xLjEuMTY5NzYxNzMzNy41NS4wLjA." 
                          alt="defaultPhoto"
                        />
                      </div>
                    </div>
                    <br />
                    {changePhotoButton()}
                  </div>
                )
              )
            }
            { imagePreviewURL ? <input type="submit" className="btn" /> : "" }
          </form>
        </div>
      </dialog>

      <Footer />
    </div>
  );
};

export default Profile;
