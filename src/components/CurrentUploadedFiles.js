import { storage } from "../firebase";
import { ref, onChildAdded, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export const CurrentUploadedFiles = ({ currentCourseID }) => {
  const STORAGE_KEY = `/courseMaterials`;
  const STORAGE_FOLDER = `/${STORAGE_KEY}/${currentCourseID}`;
  const filesRef = ref(db, STORAGE_FOLDER);
  const [fileDisplay, setFileDisplay] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const deleteFile = async (fileKey, fileName, currentCourseID) => {
    try {
      const fileStorageRef = storageRef(
        storage,
        `${STORAGE_KEY}/${currentCourseID}/${fileName}`
      );
      await deleteObject(fileStorageRef);
      const fileDatabaseRef = ref(
        db,
        `${STORAGE_KEY}/${currentCourseID}/${fileKey}`
      );
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
    setIsLoadingFiles(true);
    if (
      fileDisplay.length > 0 &&
      !fileDisplay.some((file) => file.val.courseID === currentCourseID)
    ) {
      setFileDisplay([]); // Clear the array if no files match the new courseID
    }
    onChildAdded(filesRef, (data) => {
      const newFile = { key: data.key, val: data.val() };
      if (newFile.val.courseID === currentCourseID) {
        setFileDisplay((prevFiles) => [...prevFiles, newFile]);
      }
    });
    setIsLoadingFiles(false);
  }, [currentCourseID]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Files Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {fileDisplay.map((file) => {
            return (
              <tr key={file.key}>
                <td>{file.val.fileName}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteFile(
                        file.key,
                        file.val.fileName,
                        file.val.courseID
                      );
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
