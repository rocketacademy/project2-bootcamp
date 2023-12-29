import { TextboxWithLabels } from "../components/Textbox";
import { FileUploadWithLabel } from "../components/FileUpload";
import { AssignCourseCard } from "../components/Card";

export const CourseForm = () => {
  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Create A Course</h1>

        {/* course form */}
        <form className="pb-12 border-b border-gray-900/10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <TextboxWithLabels label={"Course Title"} />
          <TextboxWithLabels label={"Course Description"} />
          <div className="col-span-full">
            <FileUploadWithLabel label={"Upload Course Materials"} />
          </div>
        </form>
        <div>
          {/* create quiz */}
          <h2 className="text-center">Create Quiz</h2>
          <form className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {/* quiz form */}
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
