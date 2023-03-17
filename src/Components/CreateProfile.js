import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";
import { upload, setUserName, setDefaultPFP, database } from "../firebase";
import "./CreateProfile.css";
import { ref, push, set } from "firebase/database";

const DB_USERS_KEY = "users";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = UserAuth();
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://i.pinimg.com/564x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg"
  );

  useEffect(() => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user.photoURL]);

  useEffect(() => {
    setDisplayName(user.displayName);
  }, []);

  function handleDisplayNameEdit(e) {
    setDisplayName(() => e.target.value);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (profilePic === null) {
      setDefaultPFP(photoURL, user, setLoading);
    }
    setUserName(displayName, user, setLoading).then(() => {
      addNewUserDB();
      navigate("/feed");
    });
  }

  function addNewUserDB() {
    console.log("run");
    set(ref(database, `${DB_USERS_KEY}/${user.uid}`), {
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  }

  function handleFile(e) {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  }

  function uploadProfilePic() {
    upload(profilePic, user, setLoading);
  }

  return (
    <div>
      <img className="profile-pic" src={photoURL} alt="photoes" />
      <br />
      Profile Picture
      <br />
      <input type="file" accept="image/*" onChange={handleFile} />
      <br />
      <button onClick={uploadProfilePic} disabled={!profilePic || loading}>
        Upload
      </button>
      <form id="profile-create" onSubmit={handleSubmit}>
        Email: <input type="text" disabled value={user.email} />
        <br />
        Display Name:{" "}
        <input
          type="text"
          value={displayName}
          placeholder={"Enter a Display Name"}
          onChange={handleDisplayNameEdit}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
