import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { storage, database } from "../firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Backdrop, CircularProgress } from "@mui/material";
import StudyDone from "./StudyComponent/StudyDone";
import "./Study.css";

export default function StudyPage() {
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const { deckID } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [studyDone, setStudyDone] = useState(false);

  useEffect(() => {
    const takeDecksInfo = async () => {
      const decksRef = ref(database, `decks/deck${deckID}`);
      return await get(decksRef);
    };

    //will improve to just fetch selected cards instead of all cards.
    const takeCardsInfo = async () => {
      const cardsRef = ref(database, `cards`);
      return await get(cardsRef);
    };

    const fetchDeckAndCards = async () => {
      const [deckInfo, cardsInfo] = await Promise.all([
        takeDecksInfo(),
        takeCardsInfo(),
      ]);
      setDecks(deckInfo.val());
      setCards(cardsInfo.val());
    };
    fetchDeckAndCards();
  }, [deckID]);

  const handleNextCard = () => {
    if (currentIndex < decks.deckCards.length - 1) {
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
  const navigate = useNavigate();

  const handleCloseStudyDone = () => {
    setStudyDone(false);
    navigate(`/`);
  };

  const STORAGE_KEY = "audio/";
  const playAudio = async () => {
    //make sure file name doesn't have whitespace, if have replace with _
    const fileName = currentCard.spanish.replace(/\s+/g, "_");
    try {
      const audioRef = storageRef(storage, `${STORAGE_KEY}/${fileName}.mp3`);
      const audioUrl = await getDownloadURL(audioRef);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.log("Error");
    }
  };

  const currentCard =
    decks.deckCards && cards[`card${decks.deckCards[currentIndex]}`];

  const totalCards = decks.deckCards ? decks.deckCards.length : 0;

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

  const deckName = decks.deckName;

  return (
    <div>
      <Backdrop open={!decks.deckCards}>
        <h3>Generating deck</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      {decks.deckCards && decks.deckCards.length > 0 && (
        <>
          <div className="study-header">
            <p>{deckName}</p>
            <div className="shuffle-quiz">
              <Button>Shuffle</Button>
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
