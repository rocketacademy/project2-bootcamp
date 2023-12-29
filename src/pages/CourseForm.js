import { TextboxWithLabels, TextboxWithoutLabels } from "../components/Textbox";
import { FileUploadWithLabel } from "../components/FileUpload";
import { AssignCourseCard } from "../components/Card";
import { useState } from "react";

export const CourseForm = () => {
  const [quizLink, setQuizLink] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

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
        <form className="pb-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          {/* Course Title Description File Upload */}
          <div className="col-span-3">
            <TextboxWithLabels
              label={"Course Title"}
              onChange={handleCourseTitle}
            />
          </div>
          <div className="col-span-3">
            <TextboxWithLabels
              label={"Course Description"}
              onChange={handleCourseDescription}
            />
          </div>
          <div className="col-span-full">
            <FileUploadWithLabel label={"Upload Course Materials"} />
          </div>

          {/* create quiz on gform*/}
          <div className="col-span-2">
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
          <div className="col-span-4">
            <TextboxWithoutLabels
              inlineLabel={"Paste the SHAREABLE Google Form link here!"}
              onChange={handleQuizLink}
            />
          </div>

          {/* assign course */}
          <div className="col-span-full">
            <AssignCourseCard cardTitle={"Assign Course"} />
          </div>
        </form>
        <button className="btn btn-primary">Submit</button>
      </div>
    </>
  );
};
