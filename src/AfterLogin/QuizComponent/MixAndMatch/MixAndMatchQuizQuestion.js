import { Card } from "@mui/material";
import MixAndMatchQuizHeader from "./MixAndMatchQuizHeader";
import AnswerDrag from "./AnswerDrag";
import { useDrop } from "react-dnd";

export default function MixAndMatchQuizQuestion(props) {
  const ItemTypes = {
    WORD: "word",
  };
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.WORD,
  }));
  const questionDisplay = props.questions.map((question) => {
    return (
      <div
        className="mix-and-match-question-pair"
        key={`english${question.cardID}`}
      >
        <Card className="mix-and-match-question-card">{question.english}</Card>
        <Card ref={drop} className="mix-and-match-question-card"></Card>
      </div>
    );
  });
  const answerDisplay = props.questions.map((question) => {
    return (
      <AnswerDrag
        word={question.spanish}
        ItemTypes={ItemTypes}
        key={`spanish${question.cardID}`}
      />
    );
  });
  return (
    <div className="page">
      <MixAndMatchQuizHeader />
      <div className="mix-and-match-question">{questionDisplay}</div>
      <div className="mix-and-match-answer">{answerDisplay}</div>
    </div>
  );
}
