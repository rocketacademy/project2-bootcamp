import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { Backdrop, CircularProgress } from "@mui/material";
import MixAndMatchQuizQuestion from "./MixAndMatchQuizQuestion";

export default function MixAndMatchQuiz(props) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    //flatten the decks of array first,
    //use set to avoid repeated ID
    const cardIDSet = new Set();
    props.decks.forEach((deck) =>
      deck.deckCards.forEach((cardID) => {
        cardIDSet.add(cardID);
      })
    );
    const cardIDs = [...cardIDSet];
    const questionIDs = [];
    //take 10 random ID from all the cards
    while (questionIDs.length < 10) {
      const randomIDindex = Math.floor(Math.random() * cardIDs.length);
      const questionID = cardIDs[randomIDindex];
      questionIDs.push(questionID);
      cardIDs.splice(randomIDindex, 1);
    }

    const makeCardPromise = async (cardID) => {
      const cardRef = ref(database, `cards/card${cardID}`);
      return await get(cardRef);
    };

    //get cards from the database
    const takeQuestionInfo = async (questionIDs) => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const card = await makeCardPromise(questionIDs[i]);
        promises.push(card.val());
      }
      const questionInfo = await Promise.all(promises);
      setQuestions(questionInfo);
    };
    takeQuestionInfo(questionIDs);
  }, [props.decks]);

  //show backdrop if question haven't been generated
  return (
    <div className="page">
      <Backdrop open={!questions.length}>
        <h3>Generating question</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      {questions.length !== 0 && (
        <MixAndMatchQuizQuestion user={props.user} questions={questions} />
      )}
    </div>
  );
}
