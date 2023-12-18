import { Button, Card, LinearProgress } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";

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
          <Card>{question.english}</Card>
          <Card>{question.choice[0]}</Card>
          <Card>{question.choice[1]}</Card>
          <Card>{question.choice[2]}</Card>
          <Card>{question.choice[3]}</Card>
          <Button variant="contained" onClick={handleNextQuestion}>
            Next Question
          </Button>
        </div>
      </div>
    );
  });
  return (
    <div className="page">
      <div className="quiz-header">
        <div className="quiz-subheader">
          <h2>{props.questions[currentQuestion].deckName}</h2>
          <DisabledByDefaultOutlinedIcon />
        </div>
        <span className="progress-number">{currentQuestion + 1}/10</span>
        <LinearProgress
          variant="determinate"
          value={(currentQuestion + 1) * 10}
          className="progress-bar"
        />
      </div>
      <div className="quiz-question">
        <style>{animate}</style> {/*put the animate style into use*/}
        {questionsDisplay}
      </div>
    </div>
  );
}
