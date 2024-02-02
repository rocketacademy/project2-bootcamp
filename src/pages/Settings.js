import React, { useState } from "react";
import { db, storage } from "../firebase";
import { deleteUser } from "firebase/auth";
import { ref, update } from "firebase/database";
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
  const { currentUser, role, photo, uid, updatePhoto } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storageReference = "profile";
    const photoRef = storageRef(storage, `${storageReference}/${uid}/`);
    uploadBytes(photoRef, file).then(() => {
      getDownloadURL(photoRef, file.name).then((url) => {
        writeData(url);
      });
    });
  };

  const writeData = (url) => {
    const dbRef = `${role.charAt(0).toUpperCase() + role.slice(1)}/${uid}`;
    const newDataRef = ref(db, dbRef);
    const data = {
      photo: url,
    };
    update(newDataRef, data);
    updateProfile(currentUser, {
      photoURL: url,
    });
    setFileInputValue("");
    setFile(null);
    updatePhoto(url);
  };

  const handleDelete = () => {
    deleteUser(currentUser).then(() => {
      console.log("deleted");
      navigate("/");
    });
  };

  return (
    <>
      {currentUser && (
        <div className="prose text-center max-w-sm m-auto my-12">
          <div className="px-6 py-4 border-4 gap-x-4 rounded-lg grid grid-cols-2 justify-items-center">
            <h2 className="col-span-2"> Edit Profile</h2>
            <form className="col-span-2" onSubmit={handleSubmit}>
              <div className="avatar placeholder col-span-2">
                {!photo ? (
                  <div className="w-40 rounded-full bg-error text-neutral-content ring ring-gray-300">
                    <span className="text-5xl">
                      <b>{currentUser.displayName.slice(0, 2).toUpperCase()}</b>
                    </span>
                  </div>
                ) : (
                  <div className="w-40 rounded-full border-gray-300 text-neutral-content ring ring-gray-300">
                    <img src={photo} alt="" />
                  </div>
                )}
              </div>
              <p className="col-span-2">
                Name: <b>{currentUser.displayName}</b> <br />
                Email: <b>{currentUser.email}</b> <br />
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
                  Are you sure you want to delete your account? This action
                  cannot be undone.
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
      )}
    </>
  );
};
export default Settings;
