import { ref, get } from "firebase/database";
import { database } from "../../firebase";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//Take the user data from App.js state

export default function QuizFirstPage(props) {
  const [userDeckIDs, setUserDeckIDs] = useState([]);
  const [userDecks, setUserDecks] = useState([]);

  //Need to replace TESTINGID with props.user.uid
  const TESTINGID = "DxXFVzvVUqSLfTtHfVUrjmV2MPW2";

  useEffect(() => {
    const takeDecksInfo = async () => {
      //Taking the decks Info
      const decksRef = ref(database, `decks`);
      return await get(decksRef);
    };

    const takeDeckIDsInfo = async () => {
      //Taking the user Decks
      const userDecksRef = ref(database, `userInfo/${TESTINGID}/decks`);
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
    const decksInfo = userDecks[`deck${e.target.value}`];
    if (e.target.checked) {
      props.setDecks((prev) => [...prev, decksInfo]);
    } else {
      props.setDecks((prev) => {
        const index = prev.findIndex(
          (deck) => deck.deckID === Number(e.target.value)
        );
        const reduced = prev.toSpliced(index, 1);
        return reduced;
      });
    }
  };

  const selection = userDeckIDs.length ? (
    userDeckIDs.map((deckID) => {
      const deckName = userDecks[`deck${deckID}`].deckName;
      const cardsNum = userDecks[`deck${deckID}`].deckCards.length;
      return (
        <FormControlLabel
          control={<Checkbox value={deckID} onChange={handleChange} />}
          label={`${deckName} (Cards: ${cardsNum})`}
          key={deckName}
        />
      );
    })
  ) : (
    <div>
      Generating deck options
      <CircularProgress color="inherit" />
    </div>
  );

  let questionAvailable = 0;
  props.decks.forEach(
    (deck) => (questionAvailable += deck.deckCards.length - 3)
  );
  //must have enough cards to start the quiz
  const isEnoughCards = questionAvailable >= 10;
  return (
    <div className="quiz-sub-page">
      <Card className="quiz-card">
        <Link to="/" className="homepage-button">
          <DisabledByDefaultOutlinedIcon />
        </Link>
        <h3>Multiple Choice Quiz</h3>
        <h4>
          Hit the 'start' button to begin this quiz. You'll have 4 answer
          options and your task is to select the correct option.
        </h4>
        <h3>Please select decks include in the quiz.</h3>
        <FormGroup>{selection}</FormGroup>
        <Button
          variant="contained"
          disabled={!isEnoughCards}
          onClick={() => props.setQuizPage(1)}
        >
          Start
        </Button>
      </Card>
    </div>
  );
}
