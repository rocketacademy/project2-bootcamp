import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { storage, database } from "../firebase";
import { Button, Card, TextField, Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
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

  const handleTranslate = async (cardID) => {
    const newValue = cards[`card${cardID}`].english;
    const response = await axios.get(
      `https://www.dictionaryapi.com/api/v3/references/spanish/json/${newValue}?key=b62458ec-20b6-4fc4-a681-0e682a4ea74e`
    );
    console.log(response);

    if (response.status === 200) {
      const apiData = response.data;

      if (apiData && apiData.length > 0) {
        // Extract the first translation
        console.log(apiData);
        const word = apiData[0].shortdef[0].split(",")[0];
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

        const updatedCards = { ...cards };
        updatedCards[`card${cardID}`].spanish = capitalizedWord;
        updatedCards[`card${cardID}`].english = newValue;
        setCards(updatedCards);
      }
    }
  };

  const handleAdd = async () => {
    const newCardID = Object.keys(cards).length + 1;
    const newCard = { cardID: newCardID, english: "", spanish: "" };
    setCards((prevCards) => ({ ...prevCards, [`card${newCardID}`]: newCard }));

    const newCardIDDeck = Object.keys(decks.deckCards).length;
    setDecks((prevDeck) => ({
      ...prevDeck,
      deckCards: {
        ...prevDeck.deckCards,
        [newCardIDDeck]: newCardID,
      },
    }));
    console.log(decks.deckCards);
    console.log(cards);
  };

  return (
    <div>
      <Backdrop open={!decks.deckCards}>
        <h3>Generating deck</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      <form>
        <h1>{deckName}</h1>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleAdd}>Add</Button>
        {decks.deckCards &&
          Object.values(decks.deckCards)
            .reverse()
            .map((cardID) => (
              <div className="edit-card">
                <TextField
                  key={`en{cardID}`}
                  value={
                    cards[`card${cardID}`] && cards[`card${cardID}`].english
                  }
                  onChange={(e) =>
                    handleFieldChange(cardID, "english", e.target.value)
                  }
                  label="English"
                ></TextField>
                <Button onClick={() => handleTranslate(cardID)}>
                  Translate
                </Button>
                <TextField
                  key={`s{cardID}`}
                  value={
                    cards[`card${cardID}`] && cards[`card${cardID}`].spanish
                  }
                  label="Spanish"
                ></TextField>
              </div>
            ))}
      </form>
    </div>
  );
}
