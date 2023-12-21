import { TextboxWithLabels } from "../components/Textbox";
import { FileUploadWithLabel } from "../components/FileUpload";

export const CourseForm = () => {
  return (
    <>
      <div className="prose">
        <h1>Create A Course</h1>

        <form>
          <TextboxWithLabels label={"Course Title"} />
          <TextboxWithLabels label={"Course Description"} />
          <FileUploadWithLabel label={"Upload File"} />
        </form>
      </div>
    </>
  );
};
