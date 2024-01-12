import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import SaveDone from "./EditComponent/SaveDone";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBhandler from "./Controller/DBhandler";
import EditCardForm from "./CardComponent/EditCardForm";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({ deckName: "" });
  const [cards, setCards] = useState([
    { cardID: Date.now(), english: "", spanish: "" },
  ]);
  const [editing, setEditing] = useState(null);
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
    if (deckID) {
      getDecksInfo();
    }
  }, [deckID, dbHandler]);

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
    const newCards = cards.filter((card) => card.cardID !== cardID);
    const newDeck = { ...deck, deckCards: newCards };
    setCards(newCards);
    setDecks(newDeck);
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
      }
      {saveDone && <SaveDone open={saveDone} onClose={handleCloseSaveDone} />}
    </div>
  );
}
