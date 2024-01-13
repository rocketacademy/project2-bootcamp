import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button, TextField } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import EditCardForm from "./CardComponent/EditCardForm";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDecks] = useState({});
  const [cards, setCards] = useState([]);
  const [editing, setEditing] = useState(null);
  const [englishInput, setEnglishInput] = useState(true);
  const [saveDone, setSaveDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage, setGoHome),
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
        setDeckName(deckInfo.deckName);
        setDecks(deckInfo);
        setCards(cardsInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    if (deckID) {
      getDecksInfo();
    } else {
      const newCardID = Date.now();
      setCards([{ cardID: newCardID, english: "", spanish: "" }]);
      setDecks({ deckName: "", deckCards: [newCardID] });
      setEditing(newCardID);
    }
  }, [deckID, dbHandler]);

  const handleSave = async () => {
    try {
      if (!cards.length) {
        throw new Error("You must have at least one card.");
      }
      if (!deckName.length) {
        throw new Error("You must have a deck name.");
      }
      if (editing) {
        throw new Error("You must finsih editing card first.");
      }
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].english === "" || cards[i].spanish === "") {
          throw new Error("You cannot save empty card.");
        }
      }
      if (deckID) {
        await dbHandler.postUserDecks(deck, deckName, cards);
      } else {
        await dbHandler.putUserDecks(deckName, cards);
      }
      setSaveDone(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCloseSaveDone = () => {
    setSaveDone(false);
    navigate(`/`);
  };

  const handleAdd = async () => {
    const newCardID = Date.now();
    const newCard = { cardID: newCardID, english: "", spanish: "" };
    setCards((prevCards) => {
      const newCards = prevCards ? [...prevCards] : [];
      newCards.unshift(newCard);
      return newCards;
    });
    setDecks((prevDeck) => {
      const newDeckCards = [...prevDeck.deckCards, newCardID];
      const newDeck = { ...prevDeck, deckCards: newDeckCards };
      return newDeck;
    });
    setEditing(newCardID);
  };

  const handleDelete = async (cardID) => {
    const newCards = cards.filter((card) => card.cardID !== cardID);
    const newCardIDs = newCards.map((card) => card.cardID);
    const newDeck = { ...deck, deckCards: newCardIDs };
    setCards(newCards);
    setDecks(newDeck);
    if (cardID === editing) setEditing(null);
  };

  const handleConfirmEdit = (english, spanish) => {
    const updatedCard = { cardID: editing, english: english, spanish: spanish };
    setCards((prev) => {
      const newCards = [...prev];
      const index = prev.findIndex((card) => card.cardID === editing);
      newCards[index] = updatedCard;
      return newCards;
    });
  };

  const handleLanguageSwitch = (card) => {
    setEnglishInput((prevEnglishInput) => !prevEnglishInput);
    console.log(englishInput);
  };

  const cardsDisplay = cards.length
    ? cards.map((card) => {
        return (
          <EditCardForm
            card={card}
            handleDelete={handleDelete}
            key={card.cardID}
            editing={editing}
            setEditing={setEditing}
            handleConfirmEdit={handleConfirmEdit}
            handleLanguageSwitch={handleLanguageSwitch}
            englishInput={englishInput}
          />
        );
      })
    : null;

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      {
        <div>
          <h1>
            <TextField
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              label="Deck Name"
            ></TextField>
          </h1>
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
      }
      {saveDone && <SaveDone open={saveDone} onClose={handleCloseSaveDone} />}
    </div>
  );
}
