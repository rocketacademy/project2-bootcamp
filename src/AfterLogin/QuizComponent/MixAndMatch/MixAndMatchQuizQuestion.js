import { Card } from "@mui/material";
import MixAndMatchQuizHeader from "./MixAndMatchQuizHeader";

export default function MixAndMatchQuizQuestion(props) {
  console.log(props.questions);
  const questionDisplay = props.questions.map((question) => {
    return (
      <div className="mix-and-match-question-pair" key={question.cardID}>
        <Card className="mix-and-match-question-card">{question.english}</Card>
        <Card className="mix-and-match-question-card"></Card>
      </div>
    );
  });
  return (
    <div className="page">
      <MixAndMatchQuizHeader />
      <div className="mix-and-match-question">{questionDisplay}</div>
    </div>
  );
}
