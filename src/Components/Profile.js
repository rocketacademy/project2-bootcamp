import React, { useEffect, useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { ref, child, get } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const DB_USERS_KEY = "users";

export default function Profile() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ displayName: "", photoURL: "" });
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  useEffect(() => {
    const userRef = ref(database, DB_USERS_KEY);
    get(child(userRef, userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.val());
          setTimeout(console.log(profile.displayName), 500);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleProfileEdit() {
    navigate("/create-profile");
  }

  return (
    <div>
      {userId === user.uid ? (
        <button onClick={handleProfileEdit}>Edit Profile</button>
      ) : null}
      <img src={profile.photoURL} alt="" />
      <h3>{profile.displayName}</h3>
      <br />
      <h3>Films Watched:</h3>
      <p>None Yet!</p>
    </div>
  );
}
