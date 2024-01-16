import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
//Take the user data from App.js state

//Component let user choose which decks to include in the quiz
export default function QuizFirstPageMixAndMatch(props) {
  const userDecks = props.userDecks;

  //handle change for user to choose/unchoose decks
  const handleChange = (e, deck) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      props.setDecks((prev) => [...prev, deck]);
    } else {
      props.setDecks((prev) => {
        const deckID = e.target.value;
        const index = prev.findIndex((deck) => deck.deckID === deckID);
        const reduced = prev.toSpliced(index, 1);
        return reduced;
      });
    }
  };

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

  const loadingPhase = (
    <div>
      Generating deck options
      <CircularProgress color="inherit" />
    </div>
  );

  let questionAvailable = 0;
  props.decks.forEach((deck) => (questionAvailable += deck.deckCards.length));
  //must have enough cards to start the quiz
  const isEnoughCards = questionAvailable >= 10;

  return (
    <div className="quiz-sub-page">
      <Card className="quiz-card">
        <Link to="/" className="homepage-button">
          <DisabledByDefaultOutlinedIcon />
        </Link>
        <h1>
          <div className="dialog-button-div">
            <Button
              variant="contained"
              className="quiz-selection-button"
              onClick={() => props.setQuizMode("MC")}
            >
              MC Quiz
            </Button>
            <Button variant="outlined" className="quiz-selection-button">
              Mix&Match Quiz
            </Button>
          </div>
        </h1>
        <h4>
          Hit the 'start' button to begin this quiz. You'll need to match all 10
          answer options with correct one.
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
