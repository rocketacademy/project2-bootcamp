import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Backdrop, CircularProgress } from "@mui/material";
import StudyDone from "./StudyComponent/StudyDone";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";

export default function StudyPage() {
  const [user] = useOutletContext();
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    if (currentIndex < Object.keys(deck.deckCards).length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDisplayEnglish(true);
    } else {
      setStudyDone(true);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDisplayEnglish(true);
    }
  };

  const handleClick = () => {
    setDisplayEnglish((prevDisplayEnglish) => !prevDisplayEnglish);
  };

  const handleCloseStudyDone = () => {
    setStudyDone(false);
    navigate(`/`);
  };

  const handleShuffle = () => {
    setCards((prev) => {
      for (let i = 0; i < prev.length; i++) {
        let temp = cards[i];
        let randomIndex = Math.floor(Math.random() * prev.length);
        cards[i] = cards[randomIndex];
        cards[randomIndex] = temp;
      }
      return [...prev];
    });
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

  const totalCards = deck.deckCards ? Object.keys(deck.deckCards).length : 0;

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
            <p>{deck.deckName}</p>
            <div className="shuffle-quiz">
              <Button onClick={handleShuffle}>Shuffle</Button>
            </div>
          </div>
          <p className="current-index">
            {currentIndex + 1}/{totalCards}
          </p>
          {progressBar({ current: currentIndex + 1, total: totalCards })}
          <Card className="study-card">
            {displayEnglish ? (
              <>
                <div className="study-card-header">
                  <p>English</p>
                </div>
                <div className="study-word" onClick={handleClick}>
                  <h1>{currentCard.english}</h1>
                </div>
                <p className="hint">Hint: Tap to flip to the other side</p>
              </>
            ) : (
              <>
                <div className="study-card-header">
                  <p>Spanish</p>
                  <Button onClick={playAudio}>Audio</Button>
                </div>
                <div className="study-word" onClick={handleClick}>
                  <h1>{currentCard.spanish}</h1>
                </div>
                <p className="hint">Hint: Tap to flip to the other side</p>
              </>
            )}
          </Card>
          <div className="prev-next">
            <Button onClick={handlePrevCard} disabled={currentIndex <= 0}>
              Prev
            </Button>
            <Button onClick={handleNextCard}>
              {currentIndex === totalCards - 1 ? "Done" : "Next"}
            </Button>
          </div>
        </>
      )}

      {/* showing dialog after reviewing done */}
      {studyDone && (
        <StudyDone open={studyDone} onClose={handleCloseStudyDone} />
      )}
    </div>
  );
}
