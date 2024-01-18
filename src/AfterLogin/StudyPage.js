import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Card,
  Button,
  Switch,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StudyDone from "./StudyComponent/StudyDone";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import TextToSpeech from "../Controller/TextToSpeech";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../Theme";
import "./Study.css";

export default function StudyPage() {
  const [user] = useOutletContext();
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [studyDone, setStudyDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [intervalID, setIntervalID] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const { deckID } = useParams();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage, setGoHome),
    [user.uid, setErrorMessage, setGoHome]
  );
  const audioHandler = useMemo(
    () =>
      new TextToSpeech(
        setErrorMessage,
        setLoadingAudio,
        process.env.REACT_APP_OPENAI_KEY
      ),
    [setErrorMessage, setLoadingAudio]
  );

  const navigate = useNavigate();

  const handleErrorMessage = () => {
    setErrorMessage("");
    if (goHome) {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dbHandler.checkUserDeckID(deckID, true);
        const { deckInfo, cardsInfo } = await dbHandler.getDeckAndCards(
          deckID,
          true
        );
        const shuffledCards = handleShuffle(cardsInfo);
        setDeck(deckInfo);
        setCards(shuffledCards);
        setLength(shuffledCards.length);
      } catch (error) {}
    };
    fetchData();
  }, [deckID, dbHandler]);

  const handleNextCard = () => {
    if (currentIndex < length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDisplayEnglish(true);
    } else {
      setStudyDone(true);
    }
  };

  const handleClick = () => {
    setDisplayEnglish((prevDisplayEnglish) => !prevDisplayEnglish);
  };

  const handleCloseStudyDone = () => {
    setStudyDone(false);
    navigate(`/`);
  };

  const handleRepeat = () => {
    setCards((prevCards) => {
      const repeatedCards = { ...prevCards[currentIndex] };
      return [...prevCards, repeatedCards];
    });
    setLength((prevLength) => prevLength + 1);
    if (currentIndex <= length) {
      setCurrentIndex(currentIndex + 1);
      setDisplayEnglish(true);
    } else {
      setStudyDone(true);
    }
  };

  const handleShuffle = (cards) => {
    for (let i = 0; i < cards.length; i++) {
      let temp = cards[i];
      let randomIndex = Math.floor(Math.random() * cards.length);
      cards[i] = cards[randomIndex];
      cards[randomIndex] = temp;
    }
    return cards;
  };

  const handlePlayAudio = async (word) => {
    try {
      setLoadingAudio(true);
      await audioHandler.playAudio(word);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleChange = (event) => {
    setAutoPlay(event.target.checked);
    if (event.target.checked) {
      const id = setInterval(() => {
        setDisplayEnglish(false);
      }, 3000);
      setIntervalID(id);
    } else {
      clearInterval(intervalID);
      setIntervalID(null);
    }
  };

  const currentCard = deck.deckCards && cards[currentIndex];

  const totalCards = deck.deckCards ? length : 0;

  const cardEnglish = (
    <>
      {currentCard && (
        <>
          <Card className="study-card-english">
            <div className="study-card-header">
              {/* <p>English</p> */}
              <img src="/UK.png" alt="uk-flag" className="study-flag-icon " />
            </div>
            <div className="study-word" onClick={handleClick}>
              <h1>{currentCard.english}</h1>
            </div>
          </Card>
          <div className="study-container-button">
            <Button
              fullWidth
              className="study-show-answer-button"
              color="primary"
              size="large"
              variant="contained"
              onClick={handleClick}
            >
              Show Answer
            </Button>
          </div>
        </>
      )}
    </>
  );

  const cardSpanish = (
    <>
      {currentCard && (
        <>
          <Card className="study-card-spanish">
            <div className="study-card-header">
              {/* <p>Spanish</p> */}
              <img
                src="/Spain.png"
                alt="spanish-flag"
                className="study-flag-icon "
              />
              <LoadingButton
                loading={loadingAudio}
                className="study-audio-loading"
                onClick={() => {
                  handlePlayAudio(currentCard.spanish);
                }}
              >
                <VolumeUpIcon fontSize="large" />
              </LoadingButton>
            </div>
            <div className="study-word" onClick={handleClick}>
              <h1>{currentCard.spanish}</h1>
            </div>
          </Card>
          <div className="study-container-button">
            <Button
              fullWidth
              color="error"
              size="large"
              variant="contained"
              onClick={handleRepeat}
            >
              👎Again
            </Button>
            <Button
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              onClick={handleNextCard}
            >
              {currentIndex === totalCards - 1 ? "Done" : "👍Good"}
            </Button>
          </div>
        </>
      )}
    </>
  );

  const progressBar = ({ current, total }) => {
    const progress = (current / total) * 100;
    return (
      <LinearProgress
        variant="determinate"
        value={progress}
        color="error"
        sx={{ marginBottom: 2 }}
      />
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <ErrorPage
          errorMessage={errorMessage}
          handleErrorMessage={handleErrorMessage}
        />
        <Backdrop open={!deck.deckCards}>
          <h3>Generating deck</h3>
          <h1>
            <CircularProgress color="inherit" />
          </h1>
        </Backdrop>

        {deck.deckCards && Object.keys(deck.deckCards).length > 0 && (
          <>
            <div className="study-header">
              <h2>{deck.deckName}</h2>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch checked={autoPlay} onChange={handleChange} />
                  }
                  label="Auto-Play"
                />
              </FormGroup>
            </div>

            <p className="study-current-index">
              {currentIndex + 1}/{totalCards}
            </p>
            {progressBar({ current: currentIndex + 1, total: totalCards })}

            <div className="study-card">
              {displayEnglish ? cardEnglish : cardSpanish}
            </div>
          </>
        )}

        {studyDone && (
          <StudyDone open={studyDone} onClose={handleCloseStudyDone} />
        )}
      </div>
    </ThemeProvider>
  );
}
