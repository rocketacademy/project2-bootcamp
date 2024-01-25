import React, { useEffect, useState } from "react";

import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, push, update, onValue } from "firebase/database";
import { updateProfile } from "firebase/auth";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const Settings = () => {
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [user, setUser] = useState("");

  const [response, setResponse] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const uid = user.uid;
        checkStudentDBV2(uid);
        checkTeacherDBV2(uid);
      }
    });
  });

  const checkStudentDBV2 = (uid) => {
    const dbRef = ref(db, `Student/${uid}`);
    get(dbRef).then((snapshot) => {
      const data = snapshot.val();

      if (data === null) {
        return;
      }
      data.role === "Student" && setResponse("Student");
    });
  };

  const checkTeacherDBV2 = (uid) => {
    const dbRef = ref(db, `Teacher/${uid}`);

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data === null) {
        return;
      }
      data.role === "Teacher" && setResponse("Teacher");
    });
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storageReference = "profile";
    const photoRef = storageRef(storage, `${storageReference}/${user.uid}/`);
    uploadBytes(photoRef, file).then(() => {
      getDownloadURL(photoRef, file.name).then((url) => {
        console.log(url);
        writeData(url);
      });
    });
  };

  console.log(user);
  console.log(response);
  const writeData = (url) => {
    const dbRef = `${response}/${user.uid}`;
    const database = ref(db);
    const newDataRef = push(ref(database, dbRef));
    const data = {
      photo: url,
    };

    update(newDataRef, data);

    updateProfile(auth.currentUser, {
      photoURL: url,
    });

    setFileInputValue("");
    setFile(null);
  };

  //   const storageReference = "profile";
  //   const photoRef = storageRef(storage, `${storageReference}/${uid}/`);
  //   uploadBytes(photoRef, file).then(() => {
  //     getDownloadURL(photoRef, file).then((url) => {
  //       console.log(url);
  //     });
  //   });
  // }, [file]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="text-center"></div>
        <p>Edit Profile</p>
        <img src={user.photoURL} alt="" />

        <p>
          Username: <span>{user.displayName}</span>
        </p>
        <p>
          Email: <span>{user.email}</span>
        </p>
        <p>
          User ID: <span>{user.uid}</span>
        </p>
        <input
          type="file"
          name="file"
          value={fileInputValue}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Settings;
