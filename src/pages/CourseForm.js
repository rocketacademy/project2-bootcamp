import {
  TextboxWithLabels,
  TextboxWithoutLabels,
  DateInputWithLabels,
} from "../components/Textbox";
import { FileUpload } from "../components/FileUpload";
import { AssignCourseCard } from "../components/Card";
import { push, ref, set } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { AlertError, AlertSuccess } from "../components/Alerts";

const generateRandomAlphanumeric = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const generateCourseID = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const randomPart = generateRandomAlphanumeric(10);

  const courseID = `${year}${month}${day}${randomPart}`;
  return courseID;
};

const extractGid = (link) => {
  const parts = link.split("#gid=");

  if (parts.length > 1) {
    return parts[1]; // Extract the GID after #gid=
  } else {
    throw new Error("Invalid Google Sheets link format");
  }
};

export const CourseForm = () => {
  const [quizLink, setQuizLink] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseID, setCourseID] = useState("");
  const [gid, setGid] = useState("");
  const [gidValue, setGidValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    getCourseID();
  }, []);

  const getCourseID = () => {
    setCourseID(generateCourseID());
  };

  const writeData = async () => {
    try {
      const newCoursesRef = push(coursesRef);
      await set(newCoursesRef, {
        createdDate: new Date().toLocaleString(),
        courseTitle: courseTitle,
        courseDescription: courseDescription,
        quizLink: quizLink,
        gid: gid,
        courseID: courseID,
        dueDate: dueDate,
      });
      window.scrollTo(0, 0); //scroll to the top after submission
      setShowSuccessAlert(true);

      // Reset success alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      setCourseTitle("");
      setCourseDescription("");
      setQuizLink("");
      setGid("");
      setGidValue("");
      getCourseID(); //regenerate courseID after clicking submit
      setDueDate("");
    } catch (error) {
      console.error("Error writing data to Firebase:", error);
      setShowErrorAlert(true);
      //bug regenerate courseID if error

      // Reset error alert after 3 seconds
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  };

  const handleQuizLink = (e) => {
    setQuizLink(e.target.value);
  };

  const handleGidLink = (e) => {
    setGidValue(e.target.value);
    const extractedGid = extractGid(e.target.value);
    console.log(`GID: ${extractedGid}`);
    setGid(extractedGid);
  };

  const handleCourseTitle = (e) => {
    setCourseTitle(e.target.value);
  };
  const handleCourseDescription = (e) => {
    setCourseDescription(e.target.value);
  };
  const handleDueDate = (e) => {
    setDueDate(e.target.value);
  };

  return (
    <>
      <div className="prose flex flex-col p-6 max-w-full">
        {/* alerts */}
        <div className="mb-5">
          {showSuccessAlert && (
            <AlertSuccess alertText={"Submitted successfully."} />
          )}

          {showErrorAlert && (
            <AlertError alertText={"Submission failed. Please try again."} />
          )}
        </div>

        <h1 className="text-center">Create A Course</h1>

        {/* course form */}
        <form className="pb-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-8">
          {/* Course Title Description File Upload */}
          <div className="sm:col-start-2 sm:col-span-2">
            <TextboxWithLabels
              label={"Course Title"}
              onChange={handleCourseTitle}
              value={courseTitle}
            />
          </div>
          <div className="sm:col-span-2">
            <TextboxWithLabels
              label={"Course Description"}
              onChange={handleCourseDescription}
              value={courseDescription}
            />
          </div>
          <div className="sm:col-span-2">
            <DateInputWithLabels
              label={"Due Date"}
              onChange={handleDueDate}
              value={dueDate}
              pattern="\d{4}-\d{2}-\d{2}"
            />
          </div>
          <div className="sm:col-start-2 sm:col-span-6">
            <FileUpload courseID={courseID} />
          </div>

          {/* create quiz on gform*/}
          <div className="sm:col-start-2 sm:col-span-1">
            <a
              role="button"
              className="btn btn-accent w-full"
              href="https://g.co/createaquiz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Quiz
            </a>
          </div>

          {/* quiz link */}
          <div className="sm:col-span-3">
            <TextboxWithoutLabels
              inlineLabel={"Paste SHAREABLE Google Form link here!"}
              onChange={handleQuizLink}
              value={quizLink}
            />
          </div>
          {/* GID link */}
          <div className="sm:col-span-2">
            <TextboxWithoutLabels
              inlineLabel={"Paste Google Sheets link here!"}
              onChange={handleGidLink}
              value={gidValue}
            />
          </div>

          {/* assign course */}
          {/* <div className="sm:col-span-6">
            <AssignCourseCard cardTitle={"Assign Course"} />
          </div> */}
          <button
            className="btn btn-primary sm:col-start-4 sm:col-span-2"
            onClick={writeData}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
