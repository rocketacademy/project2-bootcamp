import { TextboxWithLabels, TextboxWithoutLabels } from "./Textbox";
import { useState } from "react";

const MCQOption = ({ optionNum, onSelectAnswer, questionNum }) => {
  const handleSelectAnswer = (option) => {
    onSelectAnswer(option);
  };

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">
          {<TextboxWithoutLabels inlineLabel={`Option ${optionNum}`} />}
        </span>
        <input
          type="radio"
          name={`radio-${questionNum}`}
          className="radio"
          onChange={() => handleSelectAnswer(`Option ${optionNum}`)}
        />
      </label>
    </div>
  );
};

export const MCQ = ({ questionNum, onAnswerSelected }) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleAnswerSelected = (answer) => {
    setSelectedAnswer(answer);
    onAnswerSelected(questionNum, answer);
  };

  const options = [];
  for (let i = 1; i <= 4; i += 1) {
    options.push(
      <MCQOption
        key={i}
        optionNum={i}
        questionNum={questionNum}
        onSelectAnswer={handleAnswerSelected}
      />
    );
  }

  return (
    <>
      {/* Question Title */}
      <TextboxWithLabels label={`Question ${questionNum}`} />
      {/* Options */}
      {options}
      <p>
        Selected Answer for Question {questionNum}: {selectedAnswer}
      </p>
    </>
  );
};
