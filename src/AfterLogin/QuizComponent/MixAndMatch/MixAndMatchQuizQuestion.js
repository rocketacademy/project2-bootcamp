import { Card } from "@mui/material";
import MixAndMatchQuizHeader from "./MixAndMatchQuizHeader";

export default function MixAndMatchQuizQuestion(props) {
  console.log(props.questions);
  const questionDisplay = props.questions.map((question) => {
    return (
      <div
        className="mix-and-match-question-pair"
        key={`english${question.cardID}`}
      >
        <Card className="mix-and-match-question-card">{question.english}</Card>
        <Card className="mix-and-match-question-card"></Card>
      </div>
    );
  });
  const answerDisplay = props.questions.map((question) => {
    return (
      <Card
        className="mix-and-match-question-card"
        key={`spanish${question.cardID}`}
      >
        {question.spanish}
      </Card>
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
