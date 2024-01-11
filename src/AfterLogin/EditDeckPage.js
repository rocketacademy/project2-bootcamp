import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import axios from "axios";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import TextToSpeech from "./TextToSpeech";
import DBhandler from "./Controller/DBhandler";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [cards, setCards] = useState([]);
  const [saveDone, setSaveDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();
  const dbHandler = useMemo(
    () => new DBhandler(user.uid, setErrorMessage, setGoHome),
    [user.uid, setErrorMessage, setGoHome]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    if (goHome) {
      navigate("/");
    }
  };

  useEffect(() => {
    const getDecksInfo = async () => {
      try {
        await dbHandler.checkUserDeckID(deckID, true);
        const { deckInfo, cardsInfo } = await dbHandler.getDeckAndCards(
          deckID,
          true
        );
        setDecks(deckInfo);
        setCards(cardsInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getDecksInfo();
  }, [deckID, dbHandler]);

  const handleFieldChange = (cardID, language, newValue) => {
    const cardIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCard = { ...cards[cardIndex], [language]: newValue };
    const newCards = [...cards];
    newCards[cardIndex] = newCard;
    setCards(newCards);
  };

  const handleSave = async () => {
    try {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].english === "" || cards[i].spanish === "") {
          throw new Error("You cannot save empty card");
        }
      }
      await dbHandler.postUserDecks(deck, cards);
      setSaveDone(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCloseSaveDone = () => {
    setSaveDone(false);
    navigate(`/`);
  };

  const handleTranslate = async (cardID) => {
    const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
    const newValue = cards[newValueIndex].english;
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
      setCards(updatedCards);
    } catch (error) {
      setErrorMessage("No translation found.");
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

  const handleAudioURLChange = async (cardID, audioURL) => {
    const newValueIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCards = [...cards];
    newCards[newValueIndex] = {
      ...newCards[newValueIndex],
      URL: audioURL,
    };
    setCards(newCards);
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
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
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
