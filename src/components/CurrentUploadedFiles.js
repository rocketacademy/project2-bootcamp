import { storage } from "../firebase";
import { ref, onChildAdded, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const STORAGE_KEY = `/courseMaterials`;
const filesRef = ref(db, STORAGE_KEY);

export const CurrentUploadedFiles = ({ currentCourseID }) => {
  const [fileDisplay, setFileDisplay] = useState([]);

  const deleteFile = async (fileKey, fileName, currentCourseID) => {
    try {
      const fileStorageRef = storageRef(
        storage,
        `${STORAGE_KEY}/${currentCourseID}/${fileName}`
      );
      await deleteObject(fileStorageRef);
      const fileDatabaseRef = ref(db, `${STORAGE_KEY}/${fileKey}`);
      await remove(fileDatabaseRef);
      setFileDisplay((prevFiles) =>
        prevFiles.filter((file) => file.key !== fileKey)
      );
      console.log("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

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
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteFile(file.key, file.val.fileName, file.val.courseID);
            }}
          >
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
