import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";
import { Card, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import axios from "axios";
import "./Study.css";

export default function EditDeckPage() {
  const [decks, setDecks] = useState([]);
  const [decksConstant, setDecksConstant] = useState([]);
  const [cards, setCards] = useState([]);
  const { deckID } = useParams();
  const [saveDone, setSaveDone] = useState(false);

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
      setDecksConstant(deckInfo.val());
    };
    fetchDeckAndCards();
  }, [deckID]);

  const deckName = decks.deckName;

  const editableCard = decksConstant.deckCards;

  const handleFieldChange = (cardID, language, newValue) => {
    const updatedCard = { ...cards };
    updatedCard[`card${cardID}`][language] = newValue;
    setCards(updatedCard);
  };

  const handleSave = async () => {
    for (const cardID of Object.keys(cards)) {
      const currentCard = cards[cardID];
      const cardRef = ref(database, `cards/${cardID}`);
      await update(cardRef, currentCard);
    }

    const deckRef = ref(database, `decks/deck${deckID}`);
    await update(deckRef, decks);
    setSaveDone(true);
  };

  const navigate = useNavigate();
  const handleCloseSaveDone = () => {
    setSaveDone(false);
    navigate(`/`);
  };

  const handleTranslate = async (cardID) => {
    const newValue = cards[`card${cardID}`].english;

    try {
      const response = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/spanish/json/${newValue}?key=${process.env.REACT_APP_SPANISH_KEY}`
      );

      const apiData = response.data;
      console.log(apiData);
      if (apiData && apiData.length > 0) {
        // Extract the first translation
        const word = apiData[0].shortdef[0].split(",")[0];
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

        const updatedCards = { ...cards };
        updatedCards[`card${cardID}`].spanish = capitalizedWord;
        updatedCards[`card${cardID}`].english = newValue;

        // const audio = apiData[0].hwi.prs[0].sound.audio;
        // let subdir;
        // if (audio.startsWith("bix")) {
        //   subdir = "bix";
        // } else if (audio.startsWith("gg")) {
        //   subdir = "gg";
        // } else if (/[0-9_]/.test(audio.charAt(0))) {
        //   subdir = "number";
        // } else {
        //   subdir = audio.charAt(0).toLowerCase();
        // }
        // const audioLink = `https://media.merriam-webster.com/audio/prons/es/me/mp3/${subdir}/${audio}.mp3`;

        setCards(updatedCards);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const newCardID = Date.now();
    const newCard = { cardID: newCardID, english: "", spanish: "" };
    setCards((prevCards) => ({ ...prevCards, [`card${newCardID}`]: newCard }));

    const maxCardID = Math.max(...Object.keys(decks.deckCards));
    const newCardIDDeck = maxCardID + 1;

    setDecks((prevDeck) => ({
      ...prevDeck,
      deckCards: {
        ...prevDeck.deckCards,
        [newCardIDDeck]: newCardID,
      },
    }));
  };

  const handleDelete = async (cardID) => {
    const newDeck = { ...decks };
    for (const key in newDeck.deckCards) {
      if (newDeck.deckCards[key] === cardID) {
        delete newDeck.deckCards[key];
      }
    }
    setDecks(newDeck);
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
        <div className="edit-buttons">
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>

        {decks.deckCards &&
          Object.values(decks.deckCards)
            .reverse()
            .map((cardID) => (
              <Card className="edit-card">
                <div className="edit-buttons">
                  <Button
                    onClick={() => handleTranslate(cardID)}
                    disabled={Object.values(editableCard).includes(cardID)}
                  >
                    Translate
                  </Button>
                  <Button onClick={() => handleDelete(cardID)}>Delete</Button>
                </div>
                <div className="edit">
                  <TextField
                    fullWidth
                    key={`en{cardID}`}
                    value={
                      cards[`card${cardID}`] && cards[`card${cardID}`].english
                    }
                    onChange={(e) =>
                      handleFieldChange(cardID, "english", e.target.value)
                    }
                    label="English"
                    variant="standard"
                    disabled={Object.values(editableCard).includes(cardID)}
                  ></TextField>
                  <br />

                  <TextField
                    key={`s{cardID}`}
                    fullWidth
                    value={
                      cards[`card${cardID}`] && cards[`card${cardID}`].spanish
                    }
                    onChange={(e) =>
                      handleFieldChange(cardID, "spanish", e.target.value)
                    }
                    label="Spanish"
                    variant="standard"
                    disabled={Object.values(editableCard).includes(cardID)}
                  ></TextField>
                </div>
              </Card>
            ))}
      </form>
      {saveDone && <SaveDone open={saveDone} onClose={handleCloseSaveDone} />}
    </div>
  );
}
