import { storage } from "../firebase";
import { ref, onChildAdded, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const STORAGE_KEY = `/courseMaterials`;
const filesRef = ref(db, STORAGE_KEY);

const deleteFile = (fileKey, fileName) => {
  const fileRef = storageRef(storage, `${STORAGE_KEY}_${fileName}`);
  deleteObject(fileRef).then(() => {
    const fileUploadRef = ref(db, `${STORAGE_KEY}/${fileKey}`);
    remove(fileUploadRef);
  });
};

export const CurrentUploadedFiles = ({ currentCourseID }) => {
  const [fileDisplay, setFileDisplay] = useState([]);

  useEffect(() => {
    onChildAdded(filesRef, (data) => {
      console.log("Data from Firebase:", data.val());
      setFileDisplay((prevFiles) => [
        ...prevFiles,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  const filteredFiles = fileDisplay.filter(
    (file) => file.val.courseID === currentCourseID
  );

  const UploadedFilesDisplay = filteredFiles.map((file) => {
    console.log("File Object:", file);
    return (
      <tr key={file.key}>
        <td>{file.val.fileName}</td>
        <td>
          <button onClick={() => deleteFile(file.key, file.val.fileName)}>
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Files Uploaded</th>
          </tr>
        </thead>
        <tbody>{UploadedFilesDisplay}</tbody>
      </table>
    </div>
  );
};
