import { Backdrop, CircularProgress, cardClasses } from "@mui/material";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";

export default function McQuiz(props) {
  const [isCorrect, setIsCorrect] = useState(new Array(10).fill(false));
  const [isAnswered, setIsAnswered] = useState(new Array(10).fill(false));
  const [question, setQuestion] = useState([]);

  //only generate once when this component is rendered.
  useEffect(() => {
    const genQuestion = async (decks) => {
      const questionID = [];
      const genCorrectCard = () => {
        const randomDeckIndex = Math.floor(Math.random() * decks.length);
        const deckName = decks[randomDeckIndex].deckName;
        const randomCardIndex = Math.floor(
          Math.random() * decks[randomDeckIndex].deckCards.length
        );
        const correctCardID = decks[randomDeckIndex].deckCards[randomCardIndex];
        //Delete that in the state deck to prevent repetition
        console.log(decks);
        decks[randomDeckIndex].deckCards.splice(randomCardIndex, 1);
        return { deckName, randomDeckIndex, correctCardID };
      };
      const genFalseCards = (randomDeckIndex) => {
        const falseCardsID = [];
        //take 3 random answer without delete and repetition
        for (let j = 0; j < 3; j++) {
          const randomFalseCardIndex = Math.floor(
            Math.random() * decks[randomDeckIndex].deckCards.length
          );
          const randomFalseCard =
            decks[randomDeckIndex].deckCards[randomFalseCardIndex];
          //redraw a random card if the card is already drawn
          if (falseCardsID.includes(randomFalseCardIndex)) {
            j--;
            continue;
          }
          falseCardsID.push(randomFalseCard);
        }
        return falseCardsID;
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
        const { deckName, randomDeckIndex, correctCardID } = genCorrectCard();
        const falseCardsID = genFalseCards(randomDeckIndex);
        questionID.push({
          deckName: deckName,
          correct: correctCardID,
          false: falseCardsID,
        });
      }
      //Take the correct Card and false cards info
      const takeQuestionInfo = async (correctCardID, falseCardIDs) => {
        const correctCardRef = ref(database, `cards/card${correctCardID}`);
        const card = await get(correctCardRef);
        const questionInfo = {
          english: card.val().english,
          answer: card.val().spanish,
          choice: [card.val().spanish],
        };
        for (const falseCardID of falseCardIDs) {
          const falseCardRef = ref(database, `cards/card${falseCardID}`);
          const falseCard = await get(falseCardRef);
          questionInfo.choice.push(falseCard.val().spanish);
        }
        return questionInfo;
      };

      //make promises to await all
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const promise = {
          ...(await takeQuestionInfo(
            questionID[i].correct,
            questionID[i].false
          )),
          deckName: questionID[i].deckName,
        };
        promises.push(promise);
      }

      const newQuestion = await Promise.all(promises);
      setQuestion(newQuestion);
    };

    genQuestion(props.decks);
  }, []);

  console.log(question);
  return (
    <div>
      <Backdrop open={!question.length}>
        <h3>Generating question</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
    </div>
  );
}
