import { Backdrop } from "@mui/material";
import { useEffect, useState } from "react";

export default function McQuiz(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(false));
  const [question, setQuestion] = useState([]);

  //only generate once when this component is rendered.
  useEffect(() => {
    const generateQuestion = (deckIDs) => {
      //need to take all the cards from the decks first
      //
    };
    generateQuestion(props.decks);
  }, []);

  return <div>{!props.question && <Backdrop />}</div>;
}
