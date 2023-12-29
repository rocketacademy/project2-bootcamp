import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { push, ref, set, onChildAdded, remove } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export const FileUpload = () => {
  const STORAGE_KEY = `/courseMaterials`;

  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileDisplay, setFileDisplay] = useState([]);

  const handleFileUpload = (e) => {
    setFileInputFile(e.target.files[0]);
  };

  const writeData = (url, fileName) => {
    const fileUploadRef = ref(db, STORAGE_KEY);
    const newFileUploadRef = push(fileUploadRef);
    set(newFileUploadRef, {
      url: url,
      fileName: fileName,
    });
  };

  const uploadFile = () => {
    const fullStorageRef = storageRef(
      storage,
      `${STORAGE_KEY}_${fileInputFile.name}`
    );
    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url, fileInputFile.name);
      });
    });
  };

  const deleteFile = (fileKey, fileName) => {
    const fileRef = storageRef(storage, `${STORAGE_KEY}_${fileName}`);
    deleteObject(fileRef).then(() => {
      const fileUploadRef = ref(db, `${STORAGE_KEY}/${fileKey}`);
      remove(fileUploadRef);
    });
  };

  let uploadedFiles = fileDisplay.map((file) => (
    <tr key={file.key}>
      <td>{file.val.fileName}</td>
      <td>
        <button onClick={() => deleteFile(file.key, file.val.fileName)}>
          Delete
        </button>
      </td>
    </tr>
  ));

  const filesRef = ref(db, STORAGE_KEY);

  useEffect(() => {
    onChildAdded(filesRef, (data) => {
      setFileDisplay((prevFiles) => [
        ...prevFiles,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

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
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Files Uploaded</th>
            </tr>
          </thead>
          <tbody>{uploadedFiles}</tbody>
        </table>
      </div>
    </>
  );
};
