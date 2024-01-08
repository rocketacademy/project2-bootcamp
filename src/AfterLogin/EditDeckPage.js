import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { Card, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import axios from "axios";
import "./Study.css";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [deckConstant, setDeckConstant] = useState({});
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
      setDecks(deckInfo.val());
      setDeckConstant(deckInfo.val());
      const cardsInfo = cardsInfoSS.map((card) => card.val());
      setCards(cardsInfo);
    };
    fetchDeckAndCards();
  }, [deckID]);

  const handleFieldChange = (cardID, language, newValue) => {
    const cardIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCards = [...cards];
    newCards[cardIndex][language] = newValue;
    setCards(newCards);
  };

  const handleSave = async () => {
    for (const card of cards) {
      if (card.english === "" || card.spanish === "") {
        return console.log("Need to need error here");
      }
    }
    const updateCards = [];
    cards.forEach((card) => {
      const cardsConstant = deckConstant.deckCards;
      //Check for new card ID
      if (!cardsConstant.includes(card.cardID)) {
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
      const newDeck = { ...deck, deckID: deckID };
      const deckRef = ref(database, `decks/deck${deckID}`);
      await set(deckRef, newDeck);
    };
    const updateUserInfo = async (deckID) => {
      const userDeckRef = ref(database, `userInfo/${user.uid}/decks`);
      const originalDecks = await get(userDeckRef);
      const originalDecksIDs = !originalDecks.val() ? [] : originalDecks.val();
      const newDeckInfo = [...originalDecksIDs, deckID];
      await set(userDeckRef, newDeckInfo);
    };

    const newDeckID = Date.now();
    await Promise([
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
  console.log(cards);
  //Working on it
  const handleTranslate = async (cardID) => {
    const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
    const newValue = cards[newValueIndex].english;
    console.log(newValue);
    try {
      const response = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/spanish/json/${newValue}?key=${process.env.REACT_APP_SPANISH_KEY}`
      );

      const apiData = response.data;
      console.log(apiData);
      // Extract the first translation
      const word = apiData[0].shortdef[0].split(",")[0];
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      const updatedCards = [...cards];
      updatedCards[newValueIndex].spanish = capitalizedWord;
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const newCardID = Date.now();
    const newCard = { cardID: newCardID, english: "", spanish: "" };
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
          <TextField
            fullWidth
            value={card.english}
            onChange={(e) =>
              handleFieldChange(card.cardID, "english", e.target.value)
            }
            label="English"
            variant="standard"
          ></TextField>
          <br />

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
