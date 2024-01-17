import { Button, Card, CardContent } from "@mui/material";
import { useState, useMemo } from "react";
import McQuizHeader from "./McQuizHeader";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../../ErrorPage";
import DBHandler from "../../../Controller/DBHandler";

//mc question content component
export default function McQuizQuestion(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [userChoice, setUserChoice] = useState(new Array(10).fill(""));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startAnimationNext, setAnimationNext] = useState(false);
  const [startAnimationPrev, setAnimationPrev] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBHandler(props.user.uid, setErrorMessage),
    [props.user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

  //animataion frames for wipe right/left
  const animateNext = `@keyframes next-question{
    0%{right:${(currentQuestion - 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;
  const animatePrev = `@keyframes prev-question{
    0%{right:${(currentQuestion + 1) * 100}%;}
    100%{right:${currentQuestion * 100}%;}
  }`;

  //animataion style for wipe right/left
  const inlineAnimateNext = {
    animationName: startAnimationNext ? "next-question" : "none",
    animationDuration: "0.5s",
    position: "relative",
    right: `${currentQuestion * 100}%`,
  };
  const inlineAnimatePrev = {
    animationName: startAnimationPrev ? "prev-question" : "none",
    animationDuration: "0.5s",
    position: "relative",
    right: `${currentQuestion * 100}%`,
  };

  //wipe right and show animation
  const handleNextQuestion = () => {
    setAnimationNext(true);
    setCurrentQuestion((prev) => prev + 1);
  };

  //wipe left and show animation
  const handlePrevQuestion = () => {
    setAnimationPrev(true);
    setCurrentQuestion((prev) => prev - 1);
  };

  //handle after user choose choice for each question
  const handleSelectAns = (isCorrectAnswer, questionNo, choice) => {
    if (isCorrectAnswer) {
      setIsCorrect((prev) => {
        prev[questionNo] = true;
        return [...prev];
      });
    }
    setUserChoice((prev) => {
      prev[questionNo] = choice;
      return [...prev];
    });
  };

  //handle after all question is answered, and go to the report page
  const handleToResult = async () => {
    const score = isCorrect.reduce((a, b) => a + b, 0) * 10;
    const answer = props.questions.map(({ english, answer, deckName }) => {
      return { english: english, spanish: answer, deckName: deckName };
    });
    try {
      const quizID = await dbHandler.putUserQuizReport(
        score,
        answer,
        userChoice
      );
      navi(`/reportList/${quizID}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const isFinishedAllQuestion = userChoice.every((ans) => ans.length);
  //display for each of the question page
  const questionsDisplay = props.questions.map((question, i) => {
    //display for each choices for each question
    const choicesDisplay = question.choice.map((choice, j) => {
      const isCorrectAnswer = choice === question.answer;
      const isQuestionAnswered = !!userChoice[i].length;
      const IsUserChoice = !!(userChoice[i] === choice);
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
                : IsUserChoice
                ? "wrong"
                : null
            }
          >
            {isQuestionAnswered && isCorrectAnswer && <span>✓</span>}
            {IsUserChoice && !isCorrectAnswer && <span>X</span>}
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
            <div className="english-card-info">
              <h6>English</h6>
            </div>
            <div className="english-card-question">{question.english}</div>
          </Card>
          <div className="quiz-choices">{choicesDisplay}</div>
          <div className="button-div">
            <Button
              fullWidth
              variant="contained"
              className="question-button"
              onClick={handlePrevQuestion}
              disabled={startAnimationNext || startAnimationPrev || i === 0}
            >
              ←
            </Button>
            <Button
              fullWidth
              variant="contained"
              className="question-button"
              onClick={
                i === 9 && isFinishedAllQuestion
                  ? handleToResult
                  : handleNextQuestion
              }
              disabled={
                startAnimationNext ||
                startAnimationPrev ||
                (i === 9 && !isFinishedAllQuestion)
              }
            >
              {isFinishedAllQuestion && i === 9 ? "Result" : "→"}
            </Button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="page">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      <McQuizHeader
        currentQuestion={currentQuestion}
        questions={props.questions}
      />
      <div className="quiz-question">
        <style>{animateNext}</style> {/*put the animate style into use*/}
        <style>{animatePrev}</style> {/*put the animate style into use*/}
        {questionsDisplay}
      </div>
    </div>
  );
}
