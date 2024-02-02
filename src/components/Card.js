import { useCourseData } from "../components/FetchCourses";
import { Certificate } from "./Certificate";
import { storage } from "../firebase";
import { ref, remove } from "firebase/database";
import { ref as storageRef, deleteObject, listAll } from "firebase/storage";
import { db } from "../firebase";
import { useState } from "react";

export const AssignCourseCard = ({ cardTitle, studentList }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{cardTitle}</h2>
        <label className="flex items-center">
          <input type="checkbox" />
          <div className="label">
            <span className="label-text">Student 1</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export const CardWithoutActions = ({ cardContent }) => {
  return (
    <div className="card w-full bg-base-100 shadow-md">
      <div className="card-body">
        <p>{cardContent}</p>
      </div>
    </div>
  );
};

export const CourseCards = ({ courseMap }) => {
  const CourseMaterialsButton = ({ cardCourseID }) => {
    const { courseMaterialsMap } = useCourseData(cardCourseID);

    return Array.from(courseMaterialsMap.entries()).map(
      ([key, materialsData]) =>
        materialsData.courseID === cardCourseID &&
        (/\.(mp4|mov|avi|mkv)$/i.test(materialsData.fileName) ? (
          <video key={key} className="video" width="640" height="480" controls>
            <source src={materialsData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm bg-info max-w-xs min-h-10"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        ))
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-200 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge bg-base-200 text-gray-600">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title text-gray-700">{courseData.courseTitle}</h2>
        <p className="text-start text-gray-600">
          {courseData.courseDescription}
        </p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          {/* Link to quizLink */}
          <a
            href={courseData.quizLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            TAKE QUIZ
          </a>
        </div>
      </div>
    </div>
  ));
};

export const CourseCardsWithCert = ({ courseMap, displayName }) => {
  const CourseMaterialsButton = ({ cardCourseID }) => {
    const { courseMaterialsMap } = useCourseData(cardCourseID);
    return Array.from(courseMaterialsMap.entries()).map(
      ([key, materialsData]) =>
        materialsData.courseID === cardCourseID &&
        (/\.(mp4|mov|avi|mkv)$/i.test(materialsData.fileName) ? (
          <video key={key} className="video" width="640" height="480" controls>
            <source src={materialsData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm bg-info max-w-xs min-h-10"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        ))
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-200 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge bg-base-200 text-gray-600">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title text-gray-700">{courseData.courseTitle}</h2>
        <p className="text-start text-gray-600">
          {courseData.courseDescription}
        </p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          {/* Download Cert */}
          <Certificate
            userName={displayName}
            courseName={courseData.courseTitle}
          />
        </div>
      </div>
    </div>
  ));
};

export const CourseCardsWithDelete = ({ initialCourseMap }) => {
  const [courseMap, setCourseMap] = useState(initialCourseMap);
  const deleteUploadedFiles = async (courseID, courseKey) => {
    try {
      const folderStorageRef = storageRef(
        storage,
        `/courseMaterials/${courseID}`
      );
      const folderFiles = await listAll(folderStorageRef);
      await Promise.all(
        folderFiles.items.map(async (item) => {
          await deleteObject(item);
        })
      );
      // await deleteObject(fileStorageRef);
      const fileDatabaseRef = ref(db, `/courseMaterials/${courseID}`);
      await remove(fileDatabaseRef);
      const courseRef = ref(db, `/courses/${courseKey}`);
      await remove(courseRef);

      setCourseMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(courseID);
        return newMap;
      });
      console.log("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const CourseMaterialsButton = ({ cardCourseID }) => {
    const { courseMaterialsMap } = useCourseData(cardCourseID);
    return Array.from(courseMaterialsMap.entries()).map(
      ([key, materialsData]) =>
        materialsData.courseID === cardCourseID &&
        (/\.(mp4|mov|avi|mkv)$/i.test(materialsData.fileName) ? (
          <video key={key} className="video" width="640" height="480" controls>
            <source src={materialsData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm bg-info max-w-xs min-h-10"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        ))
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-200 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge bg-base-200 text-gray-600">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title text-gray-700">{courseData.courseTitle}</h2>
        <p className="text-start text-gray-600">
          {courseData.courseDescription}
        </p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          <button
            className="btn btn-accent"
            onClick={() => {
              const modal = document.getElementById("my_modal_5");
              modal.showModal();
              modal.courseID = courseID;
            }}
          >
            Delete
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-warning">
              <h3 className="font-bold text-lg">WARNING!</h3>
              <p className="py-4">
                Are you sure you want to delete this course? This action cannot
                be undone.
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn mr-3 btn-accent"
                    onClick={() => {
                      const modal = document.getElementById("my_modal_5");
                      const courseIDToDelete = modal.courseID;
                      deleteUploadedFiles(
                        courseIDToDelete,
                        courseData.firebaseKey
                      );
                    }}
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
    </div>
  ));
};
