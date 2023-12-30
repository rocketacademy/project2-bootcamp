import { TextboxWithLabels, TextboxWithoutLabels } from "../components/Textbox";
import { FileUpload } from "../components/FileUpload";
import { AssignCourseCard } from "../components/Card";
import { push, ref, set, onChildAdded, remove } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";

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

export const CourseForm = () => {
  const [quizLink, setQuizLink] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseID, setCourseID] = useState("");
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);

  useEffect(() => {
    getCourseID();
  }, []);

  const getCourseID = () => {
    setCourseID(generateCourseID());
  };

  const writeData = () => {
    const newCoursesRef = push(coursesRef);
    set(newCoursesRef, {
      createdDate: new Date().toLocaleString(),
      courseTitle: courseTitle,
      courseDescription: courseDescription,
      quizLink: quizLink,
      courseID: courseID,
    });
    setCourseTitle("");
    setCourseDescription("");
    setQuizLink("");
    getCourseID(); //regenerate courseID after clicking submit
  };

  const handleQuizLink = (e) => {
    setQuizLink(e.target.value);
  };

  const handleCourseTitle = (e) => {
    setCourseTitle(e.target.value);
  };
  const handleCourseDescription = (e) => {
    setCourseDescription(e.target.value);
  };

  console.log(courseID);
  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Create A Course</h1>

        {/* course form */}
        <form className="pb-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          {/* Course Title Description File Upload */}
          <div className="sm:col-span-3">
            <TextboxWithLabels
              label={"Course Title"}
              onChange={handleCourseTitle}
              value={courseTitle}
            />
          </div>
          <div className="sm:col-span-3">
            <TextboxWithLabels
              label={"Course Description"}
              onChange={handleCourseDescription}
              value={courseDescription}
            />
          </div>
          <div className="sm:col-span-6">
            <FileUpload courseID={courseID} />
          </div>

          {/* create quiz on gform*/}
          <div className="sm:col-span-2">
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
          <div className="sm:col-span-4">
            <TextboxWithoutLabels
              inlineLabel={"Paste the SHAREABLE Google Form link here!"}
              onChange={handleQuizLink}
              value={quizLink}
            />
          </div>

          {/* assign course */}
          <div className="sm:col-span-6">
            <AssignCourseCard cardTitle={"Assign Course"} />
          </div>
        </form>
        <button className="btn btn-primary" onClick={writeData}>
          Submit
        </button>
      </div>
    </>
  );
};
