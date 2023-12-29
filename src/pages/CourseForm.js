import { TextboxWithLabels, TextboxWithoutLabels } from "../components/Textbox";
import { FileUpload } from "../components/FileUpload";
import { AssignCourseCard } from "../components/Card";
import { push, ref, set, onChildAdded, remove } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export const CourseForm = () => {
  const [quizLink, setQuizLink] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const DB_COURSE_KEY = "courses";
  const coursesRef = ref(db, DB_COURSE_KEY);

  const writeData = () => {
    const newCoursesRef = push(coursesRef);
    set(newCoursesRef, {
      createdDate: new Date().toLocaleString(),
      courseTitle: courseTitle,
      courseDescription: courseDescription,
      quizLink: quizLink,
    });
    setCourseTitle("");
    setCourseDescription("");
    setQuizLink("");
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
            <FileUpload />
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
