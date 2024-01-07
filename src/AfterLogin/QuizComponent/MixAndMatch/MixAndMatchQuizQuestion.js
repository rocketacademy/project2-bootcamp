import { Card } from "@mui/material";
import MixAndMatchQuizHeader from "./MixAndMatchQuizHeader";
import AnswerDrag from "./AnswerDrag";
import { useDrop } from "react-dnd";
import { useState } from "react";
import AnswerDrop from "./AnswerDrop";

export default function MixAndMatchQuizQuestion(props) {
  const ItemTypes = {};
  for (let i = 0; i < 10; i++) {
    ItemTypes[`WORD${i}`] = `word${i}`;
  }

  const questionDisplay = props.questions.map((question, i) => {
    return (
      <div
        className="mix-and-match-question-pair"
        key={`english${question.cardID}`}
      >
        <Card className="mix-and-match-question-card">{question.english}</Card>
        <AnswerDrop ItemTypes={ItemTypes} i={i} />
      </div>
    );
  });

  const answerDisplay = props.questions.map((question, i) => {
    return (
      <AnswerDrag
        word={question.spanish}
        ItemTypes={ItemTypes}
        i={i}
        key={`spanish${question.cardID}`}
      />
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
