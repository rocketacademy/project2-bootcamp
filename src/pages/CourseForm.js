import { TextboxWithLabels } from "../components/Textbox";
import { FileUploadWithLabel } from "../components/FileUpload";

export const CourseForm = () => {
  return (
    <>
      <div className="">
        <p className="text-xl">Create A Course</p>

        <form>
          <TextboxWithLabels label={"Course Title"} />
          <TextboxWithLabels label={"Course Description"} />
          <FileUploadWithLabel label={"Upload File"} />
        </form>
      </div>
    </>
  );
};
