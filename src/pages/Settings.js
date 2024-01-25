import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import { ref, get, update, onValue } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthProvider";
import { useContext } from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
const Settings = () => {
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [user, setUser] = useState("");
  const [displayPhoto, setDisplayPhoto] = useState("");
  const [initials, setInitials] = useState("");
  const [response, setResponse] = useState("");
  const { currentUser, role, photo } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const uid = user.uid;
        const userInitials = user.displayName.slice(0, 2).toUpperCase();
        setInitials(userInitials);
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
  const writeData = (url) => {
    const dbRef = `${response}/${user.uid}`;
    const newDataRef = ref(db, dbRef);
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
  useEffect(() => {
    if ((file, fileInputValue)) {
      return onValue(ref(db, `${response}/${user.uid}`), (snapshot) => {
        const { photo } = snapshot.val();
        setDisplayPhoto(photo);
      });
    }
  }, [file, fileInputValue]);
  const handleDelete = () => {
    const user = auth.currentUser;
    deleteUser(user).then(() => {
      console.log("deleted");
      navigate("/");
    });
  };
  return (
    <>
      <div className="prose max-w-sm m-auto my-12">
        <div className="pr-12 pl-6 py-4 border-4 border  rounded-lg ">
          <p className="text-xl  font-bold "> Edit Profile</p>
          <form onSubmit={handleSubmit} className="text-left">
            {/* <div className="w-24 h-24 rounded-full  text-white text-center">
              <div className="rounded-full justify-content ">
                {!displayPhoto ? initials : <img src={displayPhoto} alt="" />}
              </div>
            </div> */}
            <div className="avatar placeholder">
              <div className="w-40 rounded-full bg-neutral bg-orange-700 text-white">
                {!photo ? initials : <img src={photo} alt="" />}
              </div>
            </div>
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
              label="file"
              type="file"
              value={fileInputValue}
              onChange={handleChange}
              className="mb-4"
            />
            <div>
              <button
                type="submit"
                className="text-white font-bold shadow-lg border text-sm rounded-lg block w-full p-2.5 dark:bg-red-200 dark:border-gray-600 mb-6"
              >
                Submit
              </button>
            </div>
          </form>
          <p>
            <button className="btn btn-error" onClick={handleDelete}>
              Delete account
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
export default Settings;
