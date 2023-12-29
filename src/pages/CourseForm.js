import { TextboxWithLabels } from "../components/Textbox";
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
        <form className="pb-12 border-b border-gray-900/10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <TextboxWithLabels
            label={"Course Title"}
            onChange={handleCourseTitle}
          />
          <TextboxWithLabels
            label={"Course Description"}
            onChange={handleCourseDescription}
          />
          <div className="col-span-full">
            <FileUploadWithLabel label={"Upload Course Materials"} />
          </div>
        </form>
        <div>
          {/* create quiz */}
          <h2 className="text-center">
            <a
              href="https://g.co/createaquiz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Quiz on Google Forms
            </a>
          </h2>
          <form className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {/* quiz link */}
            <TextboxWithLabels
              label={"Paste the SHAREABLE Google Form link here!"}
              onChange={handleQuizLink}
            />
          </form>
        </div>
        {/* assign course */}
        <div className="pt-12 pb-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div className="col-span-full">
            <AssignCourseCard cardTitle={"Assign Course"} />
          </div>
        </div>
      </div>
    </>
  );
};
