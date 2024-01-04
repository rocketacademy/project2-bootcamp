import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { storage, database } from "../firebase";
import { Button, Card, TextField, Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import "./Study.css";

export default function EditdeckPage() {
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const { deckID } = useParams();

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

  const deckName = decks.deckName;

  const handleFieldChange = (cardID, language, newValue) => {
    const updatedCard = { ...cards };
    updatedCard[`card${cardID}`][language] = newValue;
    setCards(updatedCard);
  };

  const handleSave = async () => {
    for (const cardID of Object.keys(cards)) {
      const cardRef = ref(database, `cards/${cardID}`);
      await update(cardRef, cards[cardID]);
    }
  };

  return (
    <div>
      <Backdrop open={!decks.deckCards}>
        <h3>Generating deck</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      <form onClick={handleSave}>
        <h1>{deckName}</h1>
        <Button>Save</Button>
        {decks.deckCards &&
          decks.deckCards.map((cardID) => (
            <div className="edit-card">
              <TextField
                key={cardID}
                value={cards[`card${cardID}`] && cards[`card${cardID}`].english}
                onChange={(e) =>
                  handleFieldChange(cardID, "english", e.target.value)
                }
                label="English"
              ></TextField>
              <TextField
                key={cardID}
                value={cards[`card${cardID}`] && cards[`card${cardID}`].spanish}
                label="Spanish"
              ></TextField>
            </div>
          ))}
      </form>
    </div>
  );
}
