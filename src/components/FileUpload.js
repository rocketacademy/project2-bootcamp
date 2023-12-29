import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { db } from "../firebase";
import { useState } from "react";

export const FileUpload = () => {
  const STORAGE_KEY = `/courseMaterials`;

  const [fileInputFile, setFileInputFile] = useState(null);

  const handleFileUpload = (e) => {
    setFileInputFile(e.target.files[0]);
  };

  const getURL = (url) => {
    const fileUploadRef = ref(db, STORAGE_KEY);
    const newFileUploadRef = push(fileUploadRef);
    set(newFileUploadRef, {
      url: url,
    });
  };

  const uploadFile = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + "_" + fileInputFile.name
    );
    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        getURL(url);
      });
    });
  };

  return (
    <>
      <label className="form-control w-full mb-2">
        <div className="label">
          <span className="label-text">Upload Course Materials</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered"
          onChange={handleFileUpload}
        />
      </label>
      <div className="btn w-full" onClick={uploadFile}>
        Upload
      </div>
    </>
  );
};
