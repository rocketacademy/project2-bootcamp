import { Button, Card } from "@mui/material";
import MixAndMatchQuizHeader from "./MixAndMatchQuizHeader";
import AnswerDrag from "./AnswerDrag";
import AnswerDrop from "./AnswerDrop";
import { useState } from "react";
import { database } from "../../../firebase";
import { get, ref, set } from "@firebase/database";
import { useNavigate } from "react-router";
import ErrorPage from "../../../ErrorPage";

export default function MixAndMatchQuizQuestion(props) {
  const [answer, setAnswer] = useState(new Array(10).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

  const ItemTypes = {};
  for (let i = 0; i < 10; i++) {
    ItemTypes[`WORD${i}`] = `word${i}`;
  }

  const handleConfirm = async () => {
    const userQuizReportRef = ref(
      database,
      `userInfo/${props.user.uid}/quizReport`
    );
    //comparing props.question with answer to check.
    let score = 0;
    const correctAnswer = props.questions.map((card, i) => {
      if (card.spanish === answer[i]) score += 10;
      return { english: card.english, spanish: card.spanish };
    });
    try {
      const userQuizReport = await get(userQuizReportRef);
      const quizNo =
        userQuizReport.val() === null
          ? 1
          : Object.values(userQuizReport.val()).length + 1;
      const newQuizReportRef = ref(
        database,
        `userInfo/${props.user.uid}/quizReport/quiz${quizNo}`
      );
      await set(newQuizReportRef, {
        quizID: quizNo,
        score: score,
        choice: answer,
        answer: correctAnswer,
        date: new Date().toLocaleDateString(),
      });
      navi(`/quizList/${quizNo}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const questionDisplay = props.questions.map((question, i) => {
    return (
      <div
        className="mix-and-match-question-pair"
        key={`english${question.cardID}`}
      >
        <Card className="mix-and-match-question-card">{question.english}</Card>
        <AnswerDrop
          ItemTypes={ItemTypes}
          i={i}
          answer={answer[i]}
          setAnswer={setAnswer}
        />
      </div>
    );
  });

  const answerDisplay = props.questions.map((question, i) => {
    return (
      <AnswerDrag
        word={question.spanish}
        ItemTypes={ItemTypes}
        i={i}
        answer={answer}
        key={`spanish${question.cardID}`}
      />
    );
  });
  //randomlize answer order
  for (let i = 0; i < answerDisplay.length; i++) {
    const randomIndex = Math.floor(Math.random() * answerDisplay.length);
    const temp = answerDisplay[randomIndex];
    answerDisplay[randomIndex] = answerDisplay[i];
    answerDisplay[i] = temp;
  }
  const isAnswerAll = !answer.includes("");
  return (
    <div className="page">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      <MixAndMatchQuizHeader />
      <div className="mix-and-match-question">{questionDisplay}</div>
      <div className="mix-and-match-answer">{answerDisplay}</div>
      <div className="dialog-button-div">
        <Button
          variant="contained"
          onClick={() => setAnswer(new Array(10).fill(""))}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          disabled={!isAnswerAll}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
