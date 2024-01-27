import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UploadPicutreModal from "../components/Settings/UploadPictureModal.js";
import SettingsModal from "../components/Settings/SettingsModal.js";
import DeleteModal from "../components/Settings/DeleteModal.js";
import LogoutModal from "../components/Settings/LogoutModal.js";

// Firebase
import { auth } from "../firebase.js";
import { database } from "../firebase.js";
import { ref, get } from "firebase/database";

// CSS
import "./Settings.css";
import SettingsSuccessModal from "../components/Settings/SettingsSuccessModal.js";

const Settings = () => {
  const [user, setUser] = useState("No user");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        setUserImg(
          "https://cdn.corporatefinanceinstitute.com/assets/money-2.jpeg"
        );
      } else {
        setUser(auth.currentUser.uid);
        setUserDisplayName(
          auth.currentUser.displayName
            ? auth.currentUser.displayName
            : "Set Name"
        );
        setUserEmail(auth.currentUser.email);
        get(ref(database, `${user}/profileImgUrl`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserImg(snapshot.val());
          }
        });
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
      <UploadPicutreModal
        user={user}
        show={showProfileModal}
        close={() => handleClose(setShowProfileModal)}
      />
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
      <LogoutModal
        show={showLogoutModal}
        close={() => handleClose(setShowLogoutModal)}
      />
      <DeleteModal
        show={showDeleteModal}
        close={() => handleClose(setShowDeleteModal)}
      />
      <Navbar />
      <div className="nav-margin settings-container">
        <div className="fw-bold ">Account Settings</div>
        <img className="mb-10p profile-img" src={userImg} alt="money" />
        <div
          className="mb-20p bottom-border"
          onClick={() => setShowProfileModal(true)}
        >
          Edit profile picture
        </div>
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
        <div
          className="mb-10p bottom-border"
          onClick={() => updateUserProfile("password")}
        >
          Change Password
        </div>
        <div
          className="mb-10p bottom-border"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </div>
        <div
          className="mb-10p bottom-border delete"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </div>
      </div>
    </div>
  );
};

export default Settings;
