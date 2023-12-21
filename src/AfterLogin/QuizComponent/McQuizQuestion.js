import { Button, Card, CardContent } from "@mui/material";
import { useState } from "react";
import McQuizHeader from "./McQuizHeader";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { ref, get, set } from "firebase/database";

export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(""));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startAnimationNext, setAnimationNext] = useState(false);
  const [startAnimationPrev, setAnimationPrev] = useState(false);
  const navi = useNavigate();

  const TESTINGID = "DxXFVzvVUqSLfTtHfVUrjmV2MPW2";

  const animateNext = `@keyframes next-question{
    0%{right:${(currentQuestion - 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;
  const animatePrev = `@keyframes prev-question{
    0%{right:${(currentQuestion + 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;

  const inlineAnimateNext = {
    animationName: startAnimationNext ? "next-question" : "none",
    animationDuration: "0.5s",
    postition: "relative",
    right: `${currentQuestion * 100}%`,
  };

  const inlineAnimatePrev = {
    animationName: startAnimationPrev ? "prev-question" : "none",
    animationDuration: "0.5s",
    postition: "relative",
    right: `${currentQuestion * 100}%`,
  };

  const handleNextQuestion = () => {
    setAnimationNext(true);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevQuestion = () => {
    setAnimationPrev(true);
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleSelectAns = (isCorrectAnswer, questionNo, choice) => {
    if (isCorrectAnswer) {
      setIsCorrect((prev) => {
        prev[questionNo] = true;
        return [...prev];
      });
    }
    setIsAnswered((prev) => {
      prev[questionNo] = choice;
      return [...prev];
    });
  };

  const handleToResult = async () => {
    const userQuizReportRef = ref(database, `userInfo/${TESTINGID}/quizReport`);
    const userQuizReport = await get(userQuizReportRef);
    const score = isCorrect.reduce((a, b) => a + b, 0) * 10;
    const answer = props.questions.map(({ answer }) => answer);
    const quizNo =
      userQuizReport === null ? Object.values(userQuizReport.length + 1) : 1;
    const newQuizReportRef = ref(
      database,
      `userInfo/${TESTINGID}/quizReport/quiz${quizNo}`
    );
    await set(newQuizReportRef, {
      quizID: quizNo,
      score: score,
      choice: isAnswered,
      answer: answer,
      date: new Date().toLocaleDateString(),
    });
    navi(`/quizList/${quizNo}`);
  };

  const questionsDisplay = props.questions.map((question, i) => {
    const choicesDisplay = question.choice.map((choice, j) => {
      const isCorrectAnswer = choice === question.answer;
      const isQuestionAnswered = Boolean(isAnswered[i].length);
      const userChoice = isAnswered[i] === choice;
      return (
        <Card
          className="spanish-card"
          key={`question${i}choice${j}`}
          onClick={() => {
            if (!isQuestionAnswered) {
              handleSelectAns(isCorrectAnswer, i, choice);
            }
          }}
        >
          <CardContent
            className={
              isCorrectAnswer && isQuestionAnswered
                ? "correct"
                : userChoice
                ? "wrong"
                : null
            }
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
        key={`question${i}`}
        style={startAnimationNext ? inlineAnimateNext : inlineAnimatePrev}
        onAnimationEnd={() => {
          setAnimationNext(false);
          setAnimationPrev(false);
        }}
      >
        <div className="quiz-sub-question-page">
          <Card className="english-card">
            <h6>English</h6>
            {question.english}
          </Card>
          {choicesDisplay}
          <div className="button-div">
            <Button
              variant="contained"
              className="question-button"
              onClick={handlePrevQuestion}
              disabled={startAnimationNext || startAnimationPrev || i === 0}
            >
              ←
            </Button>
            <Button
              variant="contained"
              className="question-button"
              onClick={handleNextQuestion}
              disabled={startAnimationNext || startAnimationPrev || i === 9}
            >
              →
            </Button>
          </div>
          {isAnswered.every((ans) => ans.length) && (
            <Button
              variant="contained"
              className="question-button"
              onClick={() => handleToResult()}
            >
              Result
            </Button>
          )}
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
        <style>{animateNext}</style> {/*put the animate style into use*/}
        <style>{animatePrev}</style>
        {questionsDisplay}
      </div>
    </div>
  );
}
