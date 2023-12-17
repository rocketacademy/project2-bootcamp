import { ref, get, set } from "firebase/database";
import { database } from "../../firebase";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
//Take the user data from App.js state

export default function QuizFirstPage() {
  const [deckIDs, setDeckIDs] = useState([]);
  const [decks, setDecks] = useState([]);

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
      setDeckIDs(newDecksIDs.val());
      setDecks(newDecks.val());
    };
    takeAllInfo();
  }, []);

  const selection = deckIDs.map((deckID) => {
    const deckName = decks[`deck${deckID}`].deckName;
    const cardsNum = decks[`deck${deckID}`].deckCards.length;
    return (
      <FormControlLabel
        control={<Checkbox />}
        label={`${deckName} (Cards: ${cardsNum})`}
      />
    );
  });

  return (
    <div>
      <h3>Multiple Choice Quiz</h3>
      <h4>
        Hit the 'start' button to begin this quiz. You'll have 4 answer options
        and your task is to select the correct option.
      </h4>
      <h3>Please select decks include in the quiz.</h3>
      <FormGroup>{selection}</FormGroup>
    </div>
  );
}
