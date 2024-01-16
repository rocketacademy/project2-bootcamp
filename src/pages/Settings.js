import React, { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// import { onAuthStateChanged } from "firebase/auth";

const Settings = () => {
  // const [user, setUser] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log(user);
  //       setUser(user);
  //     }
  //   });
  // });

  const handleChange = (e) => {
    e.preventDefault();
    const storageReference = "images";
    const userRef = "courses";

    const photoRef = storageRef(storage, `${storageReference}/${file.name}`);
    uploadBytes(photoRef, file).then(() => {
      getDownloadURL(photoRef, file.name).then((url) => {});
    });
  };
  return (
    <>
      <p>Edit Profile</p>
      {/* <p>{user}</p>*/}
      <input
        type="file"
        name="file"
        value={fileInputValue}
        onChange={handleChange}
      />
    </>
  );
};

export default Settings;
