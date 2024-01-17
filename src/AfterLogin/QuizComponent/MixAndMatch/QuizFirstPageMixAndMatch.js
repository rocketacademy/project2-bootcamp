import CloseIcon from "@mui/icons-material/Close";
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
        <div className="quiz-close-button">
          <Link to="/">
            <CloseIcon />
          </Link>
        </div>
        <h1>🔧Set up your quiz</h1>
        <div className="quiz-mode-card-container">
          <Button
            fullWidth
            className={`${
              props.quizMode === "MC" ? "quiz-chosen-button" : "quiz-mode-card"
            }`}
            onClick={() => props.setQuizMode("MC")}
            variant="contained"
          >
            📝 Multiple Choice
          </Button>
          <Button
            fullWidth
            className={`${
              props.quizMode === "MixAndMatch"
                ? "quiz-chosen-button"
                : "quiz-mode-card"
            }`}
            variant="contained"
            onClick={() => props.setQuizMode("MixAndMatch")}
          >
            📋Mix & Match
          </Button>
        </div>
        <p>Questions from:</p>
        <FormGroup>{userDecks ? selection : loadingPhase}</FormGroup>
        <Button
          fullWidth
          variant="contained"
          disabled={!isEnoughCards}
          onClick={() => props.setQuizPage(1)}
          className="quiz-start-button"
        >
          Start
        </Button>
        {!isEnoughCards && (
          <p>You need to have enough cards to start the quiz.</p>
        )}
      </Card>
    </div>
  );
}
