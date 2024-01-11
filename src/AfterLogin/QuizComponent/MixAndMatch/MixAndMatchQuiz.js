import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { Backdrop, CircularProgress } from "@mui/material";
import MixAndMatchQuizQuestion from "./MixAndMatchQuizQuestion";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../../ErrorPage";

export default function MixAndMatchQuiz(props) {
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

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
      try {
        return await get(cardRef);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    //get cards from the database
    const takeQuestionInfo = async (questionIDs) => {
      try {
        const promises = [];
        for (let i = 0; i < 10; i++) {
          const card = await makeCardPromise(questionIDs[i]);
          promises.push(card.val());
        }
        const questionInfo = await Promise.all(promises);
        setQuestions(questionInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    takeQuestionInfo(questionIDs);
  }, [props.decks]);

  //show backdrop if question haven't been generated
  return (
    <div className="page">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
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
