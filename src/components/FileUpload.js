import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { db } from "../firebase";
import { useState } from "react";
import { CurrentUploadedFiles } from "./CurrentUploadedFiles";

export const FileUpload = ({ courseID }) => {
  const STORAGE_KEY = `/courseMaterials`;
  const STORAGE_FOLDER = `/${STORAGE_KEY}/${courseID}`;

  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const handleFileUpload = (e) => {
    setFileInputFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  const writeData = (url, fileName) => {
    const fileUploadRef = ref(db, STORAGE_KEY);
    const newFileUploadRef = push(fileUploadRef);
    set(newFileUploadRef, {
      url: url,
      fileName: fileName,
      courseID: courseID,
    });
    setFileInputValue("");
  };

  const uploadFile = () => {
    const fullStorageRef = storageRef(
      storage,
      `${STORAGE_FOLDER}/${fileInputFile.name}`
    );
    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url, fileInputFile.name);
      });
    });
  };

  return (
    <>
      <div className="sm:grid sm:gap-x-4 sm:grid-cols-6">
        <label className="form-control mb-2 sm:col-span-5">
          <div className="label ">
            <span className="label-text">Upload Course Materials</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered"
            onChange={handleFileUpload}
            value={fileInputValue}
          />
        </label>
        <div
          className="btn w-full sm:col-span-1 sm:place-self-center sm:mt-7"
          onClick={uploadFile}
        >
          Upload
        </div>
        <div className="sm:col-span-6">
          <CurrentUploadedFiles currentCourseID={courseID} />
        </div>
      </div>
    </>
  );
};
