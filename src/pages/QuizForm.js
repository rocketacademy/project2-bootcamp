import { MCQ } from "../components/MCQ";
import { TextboxWithLabels } from "../components/Textbox";

export const QuizForm = () => {
  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Create A Quiz</h1>
        <form className="pb-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <TextboxWithLabels label={"Quiz Title"} />
          <MCQ />
        </form>
      </div>
    </>
  );
};
