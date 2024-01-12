import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import McQuizQuestion from "./McQuizQuestion";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../../ErrorPage";
import DBhandler from "../../Controller/DBhandler";

//show the  mc question and mc header, and contain the question generation logic
export default function McQuiz(props) {
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navi = useNavigate();
  //no need to know the user.uid
  const dbHandler = useMemo(
    () => new DBhandler(props.user.uid, setErrorMessage),
    [props.user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

  useEffect(() => {
    const genQuestion = async (decks) => {
      //question should have {deckName,correct,wrong}
      const questionIDs = [];

      const genCorrectCardID = () => {
        const deckIndex = Math.floor(Math.random() * decks.length);
        const deckName = decks[deckIndex].deckName;
        const randomCardIndex = Math.floor(
          Math.random() * decks[deckIndex].deckCards.length
        );
        const correctCardID = decks[deckIndex].deckCards[randomCardIndex];
        //Delete that in the state deck to prevent repetition
        decks[deckIndex].deckCards.splice(randomCardIndex, 1);
        return { deckName, deckIndex, correctCardID };
      };

      const genWrongCardsID = (deckIndex) => {
        const wrongCardsID = [];
        //take 3 random answer without delete and repetition
        for (let j = 0; j < 3; j++) {
          const randomWrongCardIndex = Math.floor(
            Math.random() * decks[deckIndex].deckCards.length
          );
          const randomWrongCard =
            decks[deckIndex].deckCards[randomWrongCardIndex];
          //redraw a random card if the card is already drawn
          if (wrongCardsID.includes(randomWrongCard)) {
            j--;
            continue;
          }
          wrongCardsID.push(randomWrongCard);
        }
        return wrongCardsID;
      };

      //generate 10 random cards with answer within their sets
      for (let i = 0; i < 10; i++) {
        //Delete deck when that deck do not have enough card
        for (let j = 0; j < decks.length; j++) {
          if (decks[j].deckCards.length < 4) {
            decks.splice(j, 1);
            j--;
          }
        }
        const { deckName, deckIndex, correctCardID } = genCorrectCardID();
        const wrongCardsID = genWrongCardsID(deckIndex);
        questionIDs.push({
          deckName: deckName,
          correct: correctCardID,
          wrong: wrongCardsID,
        });
      }

      //Take the correct Card and false cards info
      const takeQuestionInfo = async (correctCardID, wrongCardIDs) => {
        try {
          const card = await dbHandler.getCardInfo(correctCardID, false);
          const questionInfo = {
            english: card.english,
            answer: card.spanish,
            choice: [card.spanish],
          };
          for (const wrongCardID of wrongCardIDs) {
            const wrongCard = await dbHandler.getCardInfo(wrongCardID, false);
            //randomlize the choice order(length+1 for insert it into last index)
            const random = Math.floor(
              Math.random() * (questionInfo.choice.length + 1)
            );
            questionInfo.choice.splice(random, 0, wrongCard.spanish);
          }
          return questionInfo;
        } catch (error) {
          setErrorMessage(error.message);
        }
      };

      //make promises to await all
      try {
        const questionPromises = questionIDs.map(
          async (questionID) =>
            await takeQuestionInfo(questionID.correct, questionID.wrong)
        );
        const newQuestionWithOutDeckName = await Promise.all(questionPromises);
        const newQuestion = newQuestionWithOutDeckName.map((question, i) => {
          return { ...question, deckName: questionIDs[i].deckName };
        });
        setQuestions(newQuestion);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    genQuestion(props.decks);
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
        <McQuizQuestion user={props.user} questions={questions} />
      )}
    </div>
  );
}
