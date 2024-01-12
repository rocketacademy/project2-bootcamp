import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Backdrop, CircularProgress } from "@mui/material";
import StudyDone from "./StudyComponent/StudyDone";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

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
  const navigate = useNavigate();
  const { deckID } = useParams();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage, setGoHome),
    [user.uid, setErrorMessage, setGoHome]
  );

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
        setDeck(deckInfo);
        setCards(cardsInfo);
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

  console.log(currentIndex);

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

  const playAudio = async () => {
    try {
      const audioUrl = currentCard.URL;
      console.log(currentCard);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const currentCard = deck.deckCards && cards[currentIndex];

  const totalCards = deck.deckCards ? length : 0;

  const cardEnglish = (
    <>
      {currentCard && (
        <Card className="english">
          <div className="study-card-header">
            <p>English</p>
          </div>
          <div className="study-word" onClick={handleClick}>
            <h1>{currentCard.english}</h1>
          </div>
          <p className="hint">Hint: Tap to flip to the other side</p>
        </Card>
      )}
    </>
  );

  const cardSpanish = (
    <>
      {currentCard && (
        <>
          <Card className="spanish">
            <div className="study-card-header">
              <p>Spanish</p>
              <VolumeUpIcon
                onClick={playAudio}
                fontSize="large"
                color="primary"
              />
            </div>
            <div className="study-word" onClick={handleClick}>
              <h1>{currentCard.spanish}</h1>
            </div>
            <p className="hint">Hint: Tap to flip to the other side</p>
          </Card>
          <div className="prev-next">
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={handleRepeat}
            >
              👎Again
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
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
          </div>

          <p className="current-index">
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
  );
}
