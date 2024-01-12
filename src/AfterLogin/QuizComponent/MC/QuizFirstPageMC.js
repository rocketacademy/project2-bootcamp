import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../../../ErrorPage";
import DBHandler from "../../../Controller/DBHandler";
//Take the user data from App.js state

//Component let user choose which decks to include in the quiz
export default function QuizFirstPageMC(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [userDecks, setUserDecks] = useState(null);
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBHandler(props.user.uid, setErrorMessage),
    [props.user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { userDecks } = await dbHandler.getUserAndDecksInfo();
        setUserDecks(userDecks);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [dbHandler]);

  //handle change for user to choose/unchoose decks
  const handleChange = (e, deck) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      props.setDecks((prev) => [...prev, deck]);
    } else {
      props.setDecks((prev) => {
        const deckID = Number(e.target.value);
        const index = prev.findIndex((deck) => deck.deckID === deckID);
        const reduced = prev.toSpliced(index, 1);
        return reduced;
      });
    }
  };

  const loadingPhase = (
    <div>
      Generating deck options
      <CircularProgress color="inherit" />
    </div>
  );

  //component show the decks option
  const selection =
    userDecks && userDecks.length ? (
      userDecks.map((deck) => {
        const deckName = deck.deckName;
        const cardsNum = deck.deckCards.length;
        const deckID = deck.deckID;
        let isDeckChecked = false;
        for (const deck of props.decks) {
          if (deckID === deck.deckID) {
            isDeckChecked = true;
            break;
          }
        }
        return (
          <FormControlLabel
            control={
              <Checkbox
                value={deckID}
                onChange={(e) => handleChange(e, deck)}
                checked={isDeckChecked}
              />
            }
            label={`${deckName} (Cards: ${cardsNum})`}
            key={deckID}
          />
        );
      })
    ) : (
      <p>You need to add deck before taking the quiz.</p>
    );

  let questionAvailable = 0;
  props.decks.forEach(
    (deck) => (questionAvailable += deck.deckCards.length - 3)
  );
  //must have enough cards to start the quiz
  const isEnoughCards = questionAvailable >= 10;

  return (
    <div className="quiz-sub-page">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
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
        <FormGroup>{userDecks ? selection : loadingPhase}</FormGroup>
        <Button
          variant="contained"
          disabled={!isEnoughCards}
          onClick={() => props.setQuizPage(1)}
        >
          Start
        </Button>
        {!isEnoughCards && (
          <h6>You need to have enough cards to start the quiz.</h6>
        )}
      </Card>
    </div>
  );
}
