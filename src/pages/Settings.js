import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SettingsModal from "../components/SettingsModal.js";

// Firebase
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";

// CSS
import "./Settings.css";
import SettingsSuccessModal from "../components/SettingsSuccessModal.js";

const Settings = () => {
  const [user, setUser] = useState("No user");
  const [showInputModal, setShowInputModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userUpdateField, setUserUpdateField] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("Set Name");
  const [userEmail, setUserEmail] = useState("Please login");
  const [userImg, setUserImg] = useState(
    "https://cdn.corporatefinanceinstitute.com/assets/money-2.jpeg"
  );

  const emailToggle = false;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        setUser("No user");
        setUserDisplayName("No user");
        setUserEmail("Please Login");
      } else {
        setUser(auth.currentUser.uid);
        setUserDisplayName(
          auth.currentUser.displayName
            ? auth.currentUser.displayName
            : "Set Name"
        );
        setUserEmail(auth.currentUser.email);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const handleClose = (setter) => setter(false);

  const handleSuccessfulUpdate = () => {
    setUserDisplayName(auth.currentUser.userDisplayName);
    setUserEmail(auth.currentUser.email);
    setShowSuccessModal(true);
  };

  const updateUserProfile = (field) => {
    setUserUpdateField(field);
    setShowInputModal(true);
  };

  return (
    <div>
      <SettingsModal
        show={showInputModal}
        close={() => handleClose(setShowInputModal)}
        field={userUpdateField}
        handleSuccessfulUpdate={handleSuccessfulUpdate}
        emailToggle={emailToggle}
      />
      <SettingsSuccessModal
        show={showSuccessModal}
        close={() => handleClose(setShowSuccessModal)}
        field={userUpdateField}
      />
      <Navbar />
      <div className="nav-margin settings-container">
        <div className="fw-bold ">Account Settings</div>
        <img className="mb-10p profile-img" src={userImg} alt="money" />
        <div className="mb-20p bottom-border">Edit profile picture</div>
        <div
          className="mb-10p bottom-border"
          onClick={() => updateUserProfile("displayName")}
        >
          Name: {userDisplayName}
        </div>
        {emailToggle && (
          <div
            className="mb-10p bottom-border"
            onClick={() => updateUserProfile("email")}
          >
            Email: {userEmail}
          </div>
        )}
        <div className="mb-10p bottom-border">Change Password</div>
        <div className="mb-10p bottom-border" onClick={() => signOut(auth)}>
          Logout
        </div>
        <div className="mb-10p bottom-border">Delete Account</div>
      </div>
    </div>
  );
};

export default Settings;
