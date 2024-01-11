import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { Card, Button, TextField } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import axios from "axios";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import TextToSpeech from "./TextToSpeech";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [deckConstant, setDeckConstant] = useState({});
  const [cardsConstant, setCardsConstant] = useState([]);
  const [cards, setCards] = useState([]);
  const [saveDone, setSaveDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();

  const handleErrorMessage = () => {
    setErrorMessage("");
    if (goHome) {
      navigate("/");
    }
  };
  useEffect(() => {
    const checkUserDeckID = async () => {
      try {
        const userDeckIDsSS = await get(
          ref(database, `userInfo/${user.uid}/decks`)
        );
        const userDeckIDs = userDeckIDsSS.val();

        if (!userDeckIDs.length || !userDeckIDs.includes(Number(deckID))) {
          throw new Error("You don't have this deck!");
        }
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };
    checkUserDeckID();
    const takeDeckInfo = async () => {
      const decksRef = ref(database, `decks/deck${deckID}`);
      try {
        return await get(decksRef);
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };

    const takeCardsInfo = async (cardId) => {
      const cardsRef = ref(database, `cards/card${cardId}`);
      try {
        return await get(cardsRef);
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };

    const fetchDeckAndCards = async () => {
      try {
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
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };
    fetchDeckAndCards();
  }, [deckID, user.uid]);

  const handleFieldChange = (cardID, language, newValue) => {
    const cardIndex = cards.findIndex((card) => card.cardID === cardID);
    const newCard = { ...cards[cardIndex], [language]: newValue };
    const newCards = [...cards];
    newCards[cardIndex] = newCard;
    setCards(newCards);
  };

  const handleSave = async () => {
    try {
      let isDeckSame = true;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].english === "" || cards[i].spanish === "") {
          throw new Error("You cannot save empty card");
        }
        if (
          cards[i].english !== cardsConstant[i].english ||
          cards[i].spanish !== cardsConstant[i].spanish
        ) {
          isDeckSame = false;
        }
      }
      if (isDeckSame) {
        setSaveDone(true);
        return;
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
        const originalDecksIDs = !originalDecks.val()
          ? []
          : originalDecks.val();
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
