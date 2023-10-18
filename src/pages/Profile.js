import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";

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
    getDownloadURL 
} from "firebase/storage";

import { 
  signOut 
} from "firebase/auth";

/////////// DECALRE FIREBASE LIST NAME HERE ///////////
/////////// e.g. const DB_POSTS_KEY = "posts"; ///////////

const Profile = (props) => {
  // User Object brought in via useContext();
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  /////////// DECALRE STATES HERE ///////////
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [imagePreviewURL, setImagePreviewURL] = useState("");

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

  const uploadPhotoButton = () => {
    return (
      <div>
        <br />
        <label htmlFor="image_upload" className="btn btn-circle">
          <i class="fi fi-rr-plus"></i>
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
    setFile(e.target.files[0]);
    setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
  };

  //Equivalent to "componentDidMount()"
  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Header />
      <br />
      <div>
        Username: <span className="font-bold">{user.displayName}</span>
      </div>
      <div>
        Email: <span className="font-bold">{user.email}</span>
      </div>
      <br />
      <div>
        <button className="btn" onClick={logOut}>
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
