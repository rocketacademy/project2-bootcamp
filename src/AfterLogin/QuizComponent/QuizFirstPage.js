import { ref, get, set } from "firebase/database";
import { database } from "../../firebase";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState } from "react";
//Take the user data from App.js state

export default function QuizFirstPage(props) {
  const [userDeckIDs, setUserDeckIDs] = useState([]);
  const [userDecks, setUserDecks] = useState([]);

  //Need to replace TestingID with props.user.uid
  const TestingID = "DxXFVzvVUqSLfTtHfVUrjmV2MPW2";

  useEffect(() => {
    const takeDecksInfo = async () => {
      //Taking the decks Info
      const decksRef = ref(database, `decks`);
      return await get(decksRef);
    };

    const takeDeckIDsInfo = async () => {
      //Taking the user Decks
      const userDecksRef = ref(database, `userInfo/${TestingID}/decks`);
      return await get(userDecksRef);
    };

    const takeAllInfo = async () => {
      const [newDecksIDs, newDecks] = await Promise.all([
        takeDeckIDsInfo(),
        takeDecksInfo(),
      ]);
      setUserDeckIDs(newDecksIDs.val());
      setUserDecks(newDecks.val());
    };
    takeAllInfo();
  }, []);

  const handleChange = (e) => {
    if (e.target.checked) {
      props.setDecks((prev) => [...prev, e.target.value]);
    } else {
      props.setDecks((prev) => {
        const index = prev.indexOf(e.target.value);
        prev.splice(index, 1);
        return prev;
      });
    }
  };

  const selection = userDeckIDs.map((deckID) => {
    const deckName = userDecks[`deck${deckID}`].deckName;
    const cardsNum = userDecks[`deck${deckID}`].deckCards.length;
    return (
      <FormControlLabel
        control={<Checkbox value={deckID} onChange={handleChange} />}
        label={`${deckName} (Cards: ${cardsNum})`}
        key={deckName}
      />
    );
  });

  return (
    <div className="quiz-page">
      <Card className="quiz-first-page">
        <h3>Multiple Choice Quiz</h3>
        <h4>
          Hit the 'start' button to begin this quiz. You'll have 4 answer
          options and your task is to select the correct option.
        </h4>
        <h3>Please select decks include in the quiz.</h3>
        <FormGroup>{selection}</FormGroup>
        <Button variant="contained" onClick={() => props.setQuizPage(1)}>
          Start Quiz.
        </Button>
      </Card>
    </div>
  );
}
