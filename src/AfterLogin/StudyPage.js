import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import "./Study.css";

export default function StudyPage() {
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const { deckID } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayEnglish, setDisplayEnglish] = useState(true);

  useEffect(() => {
    const takeDecksInfo = async () => {
      //Taking the decks Info
      const decksRef = ref(database, `decks/deck${deckID}`);
      return await get(decksRef);
    };

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
          <Button>Quiz</Button>
        </div>
      </div>

      <p className="current-index">
        {currentIndex + 1}/{totalCards}
      </p>
      {progressBar({ current: currentIndex + 1, total: totalCards })}
      <Card
        onClick={handleClick}
        className={`study-card ${displayEnglish ? "english-bg" : "spanish-bg"}`}
      >
        {displayEnglish ? (
          <>
            <div className="study-card-header">
              <p>English</p>
            </div>
            <div className="study-word">
              <h1>{currentCard.english}</h1>
            </div>
            <p className="hint">Hint: Tap on this card to flip to other side</p>
          </>
        ) : (
          <>
            <div className="study-card-header">
              <p>Spanish</p>
              <button>Audio</button>
            </div>
            <div className="study-word">
              <h1>{currentCard.spanish}</h1>
            </div>
            <p className="hint">Hint: Tap on this card to flip to other side</p>
          </>
        )}
      </Card>

      <div className="prev-next">
        <Button onClick={handlePrevCard} disabled={currentIndex <= 0}>
          Prev
        </Button>
        <Button
          onClick={handleNextCard}
          disabled={currentIndex >= totalCards - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
