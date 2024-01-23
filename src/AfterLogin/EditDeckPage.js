import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SaveDone from "./EditComponent/SaveDone";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import EditCardForm from "./CardComponent/EditCardForm";
import axios from "axios";
import "./EditDeckPage.css";

export default function EditDeckPage() {
  const [user] = useOutletContext();
  const [deckName, setDeckName] = useState("");
  const [deck, setDecks] = useState({});
  const [cards, setCards] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saveDone, setSaveDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [englishToSpanish, setEnglishToSpanish] = useState(true);
  const [goHome, setGoHome] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();
  const theme = useTheme();
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
    const getDeckInfo = async () => {
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

    const genDeckInfo = async () => {
      try {
        const genCardID = await axios.get(
          "https://www.uuidgenerator.net/api/version7"
        );
        const newCardID = genCardID.data;
        setCards([{ cardID: newCardID, english: "", spanish: "" }]);
        setDecks({ deckName: "", deckCards: [newCardID] });
        setEditing(newCardID);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    if (deckID) {
      getDeckInfo();
    } else {
      genDeckInfo();
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
    let hasEmptyCard = false;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card.english || !card.spanish) {
        hasEmptyCard = true;
        break;
      }
    }

    if (hasEmptyCard) {
      setErrorMessage(
        "Oops, seems that you have an unfinished or unsaved card. Tip: make sure you save a newly created card  by clicking ☑️ before you add a new empty card 😉"
      );
      return;
    }

    try {
      const res = await axios.get("https://www.uuidgenerator.net/api/version7");
      const newCardID = res.data;
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
    } catch (error) {
      setErrorMessage(error.message);
    }
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
  const handleLanguageSwitch = () => {
    setEnglishToSpanish((prevEnglishInput) => !prevEnglishInput);
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
            englishToSpanish={englishToSpanish}
            setEnglishToSpanish={setEnglishToSpanish}
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
          <div className="top-buttons">
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "rgb(79, 110, 247)",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "8px",
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "12px",
                },
              }}
              onClick={handleLanguageSwitch}
            >
              Switch languages
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "rgb(79, 110, 247)",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "8px",
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "12px",
                },
              }}
              onClick={handleSave}
            >
              Save deck
            </Button>
          </div>
          <div className="content-container">
            <div className="deck-name-field">
              <TextField
                style={{
                  width: "70vw",
                  marginBottom: "25px",
                  marginTop: "20px",
                  backgroundColor: "white",
                }}
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                label="Deck Name"
              ></TextField>
            </div>

            <Button
              variant="outlined"
              className="add-card-button"
              onClick={handleAdd}
              sx={{
                color: "black",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "10px",
                  padding: "6px 12px",
                  height: "40px",
                  marginTop: "20px",
                  marginBottom: "5px",
                },
                [theme.breakpoints.up("md")]: {
                  fontSize: "14px",
                  padding: "12px 24px",
                  height: "50px",
                  marginTop: "40px",
                  marginBottom: "10px",
                },
                [theme.breakpoints.up("lg")]: {
                  fontSize: "18px",
                  padding: "15px 30px",
                  height: "65px",
                  marginTop: "50px",
                  marginBottom: "10px",
                },
              }}
            >
              + New card
            </Button>
            <div> {cardsDisplay}</div>
          </div>
        </div>
      }
      {saveDone && <SaveDone open={saveDone} onClose={handleCloseSaveDone} />}
    </div>
  );
}
