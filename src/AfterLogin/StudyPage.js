import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
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

    const takeCardsInfo = async (cardNumber) => {
      const cardsRef = ref(database, `cards/card${cardNumber}`);
      return await get(cardsRef);
    };

    const fetchDeckAndCards = async () => {
      const deckInfo = await takeDecksInfo();
      const deckInfoData = deckInfo.val();

      if (deckInfoData) {
        const cardNumber = Object.values(deckInfoData.deckCards);
        const cardPromises = cardNumber.map((cardID) => takeCardsInfo(cardID));
        const cardInfo = await Promise.all(cardPromises);
        const cardInfoData = cardInfo.map((number) => number.val());

        setDecks(deckInfoData);
        setCards(cardInfoData);
      }
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

  const STORAGE_KEY = "audio/";

  const playAudio = async () => {
    //make sure file name doesn't have whitespace, if have replace with _
    const fileName = currentCard.spanish.replace(/\s+/g, "_").toLowerCase();
    try {
      const audioRef = storageRef(storage, `${STORAGE_KEY}/${fileName}.mp3`);
      const audioUrl = await getDownloadURL(audioRef);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.log("Error");
    }
  };

  const currentCard = decks.deckCards && cards[currentIndex];

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
