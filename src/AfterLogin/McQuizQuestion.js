import styled from "@emotion/styled";
import { Button, Card } from "@mui/material";
import { useState } from "react";

export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(false));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startAnimation, setAnimation] = useState(false);

  const animate = `@keyframes next-question{
    0%{right:${(currentQuestion - 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;

  const handleNextQuestion = () => {
    setAnimation(true);
    setCurrentQuestion((prev) => prev + 1);
  };

  const questionsDisplay = props.questions.map((question, i) => {
    return (
      <div
        className="quiz-sub-page"
        key={`question${i + 1}`}
        style={{
          animationName: startAnimation ? "next-question" : "none",
          animationDuration: "0.5s",
          postition: "relative",
          right: `${currentQuestion * 100}%`,
        }}
        onAnimationEnd={() => setAnimation(false)}
      >
        <Card className="quiz-card">
          {question.english}
          <Button onClick={handleNextQuestion}>Right</Button>
        </Card>
      </div>
    );
  });
  return (
    <div className="quiz-question">
      <style>{animate}</style> {/*put the animate style into use*/}
      {questionsDisplay}
    </div>
  );
}
