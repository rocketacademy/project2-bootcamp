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
    if (file && fileInputValue) {
      return onValue(ref(db, `${response}/${user.uid}`), (snapshot) => {
        const { photo } = snapshot.val();
        setDisplayPhoto(photo);
      });
    }
  }, [file, fileInputValue, photo]);

  console.log(displayPhoto);

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
        <div className="px-6 py-4 border-4 gap-x-4 rounded-lg grid grid-cols-2 justify-items-center">
          <h2 className="col-span-2"> Edit Profile</h2>
          <form className="col-span-2" onSubmit={handleSubmit}>
            <div className="avatar placeholder col-span-2">
              <div className="w-40 rounded-full bg-neutral text-white">
                {!photo ? initials : <img src={photo} alt="" />}
              </div>
            </div>
            <p className="col-span-2">
              Name: <b>{user.displayName}</b> <br />
              Email: <b>{user.email}</b> <br />
              User ID: {user.uid}
            </p>
            <label className="form-control col-span-2">
              <div className="label ">
                <span className="label-text">Upload Photo</span>
              </div>
              <input
                label="file"
                type="file"
                value={fileInputValue}
                onChange={handleChange}
                className="file-input file-input-info max-w-xs col-span-2 mb-6"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary col-span-2 w-full mb-10 max-w-xs"
            >
              Submit
            </button>
          </form>
          <button
            className="btn btn-accent col-span-2 max-w-xs mb-14"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Delete account
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-warning">
              <h3 className="font-bold text-lg">WARNING!</h3>
              <p className="py-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn mr-3 btn-accent"
                    onClick={handleDelete}
                  >
                    Confirm Delete
                  </button>
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
};
export default Settings;
