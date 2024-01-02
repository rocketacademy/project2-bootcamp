import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
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

  const deckName = decks.deckName;

  return (
    <div>
      <p>{deckName}</p>
      <p>
        {currentIndex + 1}/{totalCards}
      </p>
      <div onClick={handleClick} className="study-card">
        {displayEnglish ? (
          <>
            <p>English</p>
            <div className="study-word">
              <h1>{currentCard.english}</h1>
            </div>
          </>
        ) : (
          <>
            <p>Spanish</p>
            <div className="study-word">
              <h1>{currentCard.spanish}</h1>
            </div>
          </>
        )}
      </div>

      <button onClick={handlePrevCard}>Prev</button>
      <button onClick={handleNextCard}>Next</button>
    </div>
  );
}
