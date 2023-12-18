import { Card } from "@mui/material";
import { useState } from "react";

export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(false));
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const questionsDisplay = props.questions.map((question, i) => {
    return (
      <div className="quiz-sub-page" key={`question${i + 1}`}>
        <Card className="quiz-card">{question.english}</Card>
      </div>
    );
  });

  return <div className="quiz-question">{questionsDisplay}</div>;
}
