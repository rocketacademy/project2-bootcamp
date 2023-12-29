import { MCQ } from "../components/MCQ";
import { TextboxWithLabels } from "../components/Textbox";
import { useState } from "react";

export const QuizForm = () => {
  const [questions, setQuestions] = useState([{ id: 1, title: "Question 1" }]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      title: `Question ${questions.length + 1}`,
    };

    setQuestions([...questions, newQuestion]);
  };

  return (
    <>
      <div className="prose flex flex-col p-6">
        <h1 className="text-center">Create A Quiz</h1>
        <form className="grid grid-cols-1 gap-x-6 gap-y-4">
          <div className="mb-5">
            <TextboxWithLabels label={"Quiz Title"} />
          </div>

          {questions.map((question) => (
            <div className="mb-5">
              <MCQ key={question.id} questionNum={question.id} />
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white p-2 mt-4"
          >
            Add Question
          </button>
        </form>
      </div>
    </>
  );
};
