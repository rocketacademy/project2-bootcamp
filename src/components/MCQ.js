import { TextboxWithLabels, TextboxWithoutLabels } from "./Textbox";

const MCQAnswer = ({ optionNum }) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">
          {<TextboxWithoutLabels inlineLabel={`Option ${optionNum}`} />}
        </span>
        <input type="radio" name="radio-1" className="radio" />
      </label>
    </div>
  );
};

export const MCQ = () => {
  return (
    <>
      {/* Question Title */}
      <TextboxWithLabels label={"Question"} />
      {/* Options */}
      <MCQAnswer optionNum={1} />
      <MCQAnswer optionNum={2} />
      <MCQAnswer optionNum={3} />
      <MCQAnswer optionNum={4} />
    </>
  );
};
