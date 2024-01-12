import { useEffect, useMemo, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import MixAndMatchQuizQuestion from "./MixAndMatchQuizQuestion";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../../ErrorPage";
import DBhandler from "../../Controller/DBhandler";

export default function MixAndMatchQuiz(props) {
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBhandler(props.user.uid, setErrorMessage),
    [props.user.uid, setErrorMessage]
  );

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
    const questionCardIDs = [];
    //take 10 random ID from all the cards
    while (questionCardIDs.length < 10) {
      const randomIDindex = Math.floor(Math.random() * cardIDs.length);
      const questionID = cardIDs[randomIDindex];
      questionCardIDs.push(questionID);
      cardIDs.splice(randomIDindex, 1);
    }

    const fetchData = async () => {
      try {
        const questionPromises = questionCardIDs.map(
          async (cardID) => await dbHandler.getCardInfo(cardID)
        );
        const questionInfo = await Promise.all(questionPromises);
        setQuestions(questionInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [props.decks, dbHandler]);

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
