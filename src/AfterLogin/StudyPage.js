import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
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

  //need to make sure the data is fetched before performing these.
  const cardNum = "card" + decks.deckCards[currentIndex];
  const currentCard = cards[cardNum];

  const totalCards = decks.deckCards.length;

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
            <p className="hint">Hint: Tap to flip to other side</p>
          </>
        ) : (
          <>
            <div className="study-card-header">
              <p>Spanish</p>
              <Button>Audio</Button>
            </div>
            <div className="study-word" onClick={handleClick}>
              <h1>{currentCard.spanish}</h1>
            </div>
            <p className="hint">Hint: Tap to flip to other side</p>
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

      {/* showing dialog after reviewing done */}
      {studyDone && (
        <StudyDone open={studyDone} onClose={handleCloseStudyDone} />
      )}
    </div>
  );
}
