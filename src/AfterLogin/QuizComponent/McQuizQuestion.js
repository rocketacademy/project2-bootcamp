import { Button, Card } from "@mui/material";
import { useState } from "react";
import McQuizHeader from "./McQuizHeader";

export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(false));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startAnimation, setAnimation] = useState(false);

  const animate = `@keyframes next-question{
    0%{right:${(currentQuestion - 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;
  const inlineAnimate = {
    animationName: startAnimation ? "next-question" : "none",
    animationDuration: "0.5s",
    postition: "relative",
    right: `${currentQuestion * 100}%`,
  };

  const handleNextQuestion = () => {
    setAnimation(true);
    setCurrentQuestion((prev) => prev + 1);
  };

  const questionsDisplay = props.questions.map((question, i) => {
    return (
      <div
        className="quiz-sub-page"
        key={`question${i + 1}`}
        style={inlineAnimate}
        onAnimationEnd={() => setAnimation(false)}
      >
        <div className="quiz-sub-question-page">
          <Card className="english-card">
            <h6>English</h6>
            {question.english}
          </Card>
          <Card className="spanish-card">{question.choice[0]}</Card>
          <Card className="spanish-card">{question.choice[1]}</Card>
          <Card className="spanish-card">{question.choice[2]}</Card>
          <Card className="spanish-card">{question.choice[3]}</Card>
          <Button variant="contained" onClick={handleNextQuestion}>
            Next Question
          </Button>
        </div>
      </div>
    );
  });
  return (
    <div className="page">
      <McQuizHeader
        currentQuestion={currentQuestion}
        questions={props.questions}
      />
      <div className="quiz-question">
        <style>{animate}</style> {/*put the animate style into use*/}
        {questionsDisplay}
      </div>
    </div>
  );
}
