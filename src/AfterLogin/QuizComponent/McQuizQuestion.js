import { Button, Card, CardContent } from "@mui/material";
import { useState } from "react";
import McQuizHeader from "./McQuizHeader";

export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10));
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
  const handleSelectAns = (isCorrectAnswer, questionNo, choiceNo) => {
    if (isCorrectAnswer) {
      setIsCorrect((prev) => {
        prev[questionNo] = true;
        return [...prev];
      });
    }
    setIsAnswered((prev) => {
      prev[questionNo] = choiceNo;
      return [...prev];
    });
  };

  const questionsDisplay = props.questions.map((question, i) => {
    const choicesDisplay = question.choice.map((choice, j) => {
      const isCorrectAnswer = choice === question.answer;
      const isQuestionAnswered = isAnswered[i] < 4;
      const userChoice = isAnswered[i] === j;
      return (
        <Card
          className="spanish-card"
          key={`question${i}choice${j}`}
          onClick={() => {
            if (!isQuestionAnswered) {
              handleSelectAns(isCorrectAnswer, i, j);
            }
          }}
        >
          <CardContent
            className={`spanish-card-content 
              ${
                isCorrectAnswer && isQuestionAnswered
                  ? "correct"
                  : userChoice
                  ? "wrong"
                  : null
              }`}
          >
            {isQuestionAnswered && isCorrectAnswer && <span>✓</span>}
            {userChoice && !isCorrectAnswer && <span>X</span>}
            {choice}
          </CardContent>
        </Card>
      );
    });
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
          {choicesDisplay}
          <Button variant="contained" onClick={handleNextQuestion}>
            Next Question
          </Button>
        </div>
      </div>
    );
  });

  console.log(props.questions);
  console.log(isAnswered);
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
