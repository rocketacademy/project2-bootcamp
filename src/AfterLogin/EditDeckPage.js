import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database, storage } from "../firebase";
import { Card, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import axios from "axios";
import "./Study.css";
import TextToSpeech from "./TextToSpeech";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [deckConstant, setDeckConstant] = useState({});
  const [cardsConstant, setCardsConstant] = useState([]);
  const [cards, setCards] = useState([]);
  const [saveDone, setSaveDone] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();

  useEffect(() => {
    const takeDeckInfo = async () => {
      const decksRef = ref(database, `decks/deck${deckID}`);
      return await get(decksRef);
    };

    const takeCardsInfo = async (cardId) => {
      const cardsRef = ref(database, `cards/card${cardId}`);
      return await get(cardsRef);
    };

    const fetchDeckAndCards = async () => {
      const deckInfo = await takeDeckInfo();
      const cardsPromise = deckInfo
        .val()
        .deckCards.map(async (cardId) => await takeCardsInfo(cardId));
      const cardsInfoSS = await Promise.all(cardsPromise);
      const newDeck = deckInfo.val();
      setDecks(newDeck);
      setDeckConstant({ ...newDeck });
      const cardsInfo = cardsInfoSS.map((card) => card.val());
      setCards(cardsInfo);
      setCardsConstant([...cardsInfo]);
    };

    fetchDeckAndCards();
  }, [deckID]);

  const handleFieldChange = (cardID, language, newValue) => {
    const cardIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCard = { ...cards[cardIndex], [language]: newValue };
    const newCards = [...cards];
    newCards[cardIndex] = newCard;
    setCards(newCards);
  };

  const handleSave = async () => {
    for (const card of cards) {
      if (card.english === "" || card.spanish === "") {
        return console.log("Need to need error here");
      }
    }
    const updateCards = [];
    cards.forEach((card, i) => {
      const cardIDsConstant = deckConstant.deckCards;
      //Check for new card ID
      if (!cardIDsConstant.includes(card.cardID)) {
        updateCards.push(card);
      } else {
        //Check for same ID but different English/Spanish
        const cardConstantIndex = cardsConstant.findIndex(
          (cardConstant) => cardConstant.cardID === card.cardID
        );
        if (
          cardsConstant[cardConstantIndex].english !== card.english ||
          cardsConstant[cardConstantIndex].spanish !== card.spanish
        ) {
          card.cardID = Date.now();
          card.cardID += i;
          updateCards.push(card);
        }
      }
    });
    const putNewCard = async (card) => {
      const newCardRef = ref(database, `cards/card${card.cardID}`);
      await set(newCardRef, card);
    };
    const cardsPromises = updateCards.map(
      async (card) => await putNewCard(card)
    );
    const putNewDeck = async (deckID) => {
      const newCardIDs = cards.map((card) => card.cardID);
      const newDeck = { ...deck, deckID: deckID, deckCards: newCardIDs };
      const deckRef = ref(database, `decks/deck${deckID}`);
      await set(deckRef, newDeck);
    };
    const updateUserInfo = async (deckID) => {
      const userDeckRef = ref(database, `userInfo/${user.uid}/decks`);
      const originalDecks = await get(userDeckRef);
      const originalDecksIDs = !originalDecks.val() ? [] : originalDecks.val();
      const newDeckInfo = [...originalDecksIDs, deckID];
      //need to delete the old deck
      const oldDeckIndex = newDeckInfo.findIndex(
        (deckID) => deckID === deckConstant.deckID
      );
      newDeckInfo.splice(oldDeckIndex, 1);
      await set(userDeckRef, newDeckInfo);
    };

    const newDeckID = Date.now();
    await Promise.all([
      ...cardsPromises,
      await putNewDeck(newDeckID),
      await updateUserInfo(newDeckID),
    ]);
    setSaveDone(true);
  };

  const handleCloseSaveDone = () => {
    setSaveDone(false);
    navigate(`/`);
  };

  const handleTranslate = async (cardID) => {
    const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
    const newValue = cards[newValueIndex].english;
    console.log(newValue);
    try {
      const response = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/spanish/json/${newValue}?key=${process.env.REACT_APP_SPANISH_KEY}`
      );

      const apiData = response.data;

      // Extract the first translation
      const word = apiData[0].shortdef[0].split(",")[0];
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      const updatedCards = [...cards];
      updatedCards[newValueIndex].spanish = capitalizedWord;
      setCards(updatedCards);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const newCardID = Date.now();
    const newCard = { cardID: newCardID, english: "", spanish: "", URL: "" };
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards.unshift(newCard);
      return newCards;
    });
    setDecks((prevDeck) => {
      const newDeckCards = [...prevDeck.deckCards, newCardID];
      const newDeck = { ...prevDeck, deckCards: newDeckCards };
      return newDeck;
    });
  };

  const handleDelete = async (cardID) => {
    const newDeck = { ...deck };
    for (const key in newDeck.deckCards) {
      if (newDeck.deckCards[key] === cardID) {
        delete newDeck.deckCards[key];
      }
    }
    const newCards = cards.filter((card) => card.cardID !== cardID);
    setCards(newCards);
    setDecks(newDeck);
  };

  const handleAudioURLChange = async (cardID, audioURL) => {
    const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCards = [...cards];
    newCards[newValueIndex] = {
      ...newCards[newValueIndex],
      URL: audioURL,
    };
    setCards(newCards);
  };

  console.log(cards);

  const cardsDisplay =
    cards.length &&
    cards.map((card) => (
      <Card className="edit-card" key={card.cardID}>
        <div className="edit-buttons">
          <Button onClick={() => handleTranslate(card.cardID)}>
            Translate
          </Button>
          <Button onClick={() => handleDelete(card.cardID)}>Delete</Button>
        </div>
        <div className="edit">
          <div className="field">
            <TextField
              fullWidth
              value={card.english}
              onChange={(e) =>
                handleFieldChange(card.cardID, "english", e.target.value)
              }
              label="English"
              variant="standard"
            ></TextField>
          </div>
          <br />
          <div className="field-audio">
            <div className="field">
              <TextField
                fullWidth
                value={card.spanish}
                onChange={(e) =>
                  handleFieldChange(card.cardID, "spanish", e.target.value)
                }
                label="Spanish"
                variant="standard"
              ></TextField>
            </div>
            <TextToSpeech
              card={card.spanish}
              onAudioURLChange={(audioURL) =>
                handleAudioURLChange(card.cardID, audioURL)
              }
            />
          </div>
        </div>
      </Card>
    ));
  return (
    <div>
      <Backdrop open={!cards.length}>
        <h3>Getting deck and cards</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      {!!cards.length && (
        <div>
          <h1>{deck.deckName}</h1>
          <div className="edit-buttons">
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </div>
          {cardsDisplay}
        </div>
      )}
      {saveDone && <SaveDone open={saveDone} onClose={handleCloseSaveDone} />}
    </div>
  );
}
