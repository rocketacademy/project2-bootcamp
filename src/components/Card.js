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
        materialsData.courseID === cardCourseID && (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm btn-outline max-w-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        )
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-100 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge badge-base-100">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title">{courseData.courseTitle}</h2>
        <p className="text-start">{courseData.courseDescription}</p>
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

export const CourseCardsWithCert = ({ courseMap }) => {
  const { courseMaterialsMap } = useCourseData();

  const CourseMaterialsButton = ({ cardCourseID }) => {
    return Array.from(courseMaterialsMap.entries()).map(
      ([key, materialsData]) =>
        materialsData.courseID === cardCourseID && (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm btn-outline max-w-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        )
    );
  };

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-100 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge badge-base-100">
            Due Date: {courseData.dueDate}
          </div>
        </div>
        <h2 className="card-title">{courseData.courseTitle}</h2>
        <p className="text-start">{courseData.courseDescription}</p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          {/* Download Cert */}
          <Certificate
            userName={"HELLO123"}
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
    console.log(courseKey);
    try {
      const folderStorageRef = storageRef(
        storage,
        `/courseMaterials/${courseID}`
      );
      const folderFiles = await listAll(folderStorageRef);
      console.log(folderFiles);
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
        materialsData.courseID === cardCourseID && (
          <a
            key={key}
            href={materialsData.url}
            className="btn btn-sm btn-outline max-w-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {materialsData.fileName}
          </a>
        )
    );
  };

  console.log(courseMap);

  return Array.from(courseMap.entries()).map(([courseID, courseData]) => (
    <div
      key={courseID}
      className="card max-w-full mb-8 bg-base-100 shadow-xl sm:col-start-2 sm:col-span-5"
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge badge-base-100">
            Due Date: {courseData.dueDate}
          </div>
          <div className="badge badge-base-100">
            Course Key: {courseData.firebaseKey}
          </div>
        </div>
        <h2 className="card-title">{courseData.courseTitle}</h2>
        <p className="text-start">{courseData.courseDescription}</p>
        <div className="card-actions justify-start">
          <CourseMaterialsButton cardCourseID={courseID} />
        </div>
        <div className="mt-5 card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              deleteUploadedFiles(courseID, courseData.firebaseKey);
            }}
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  ));
};
