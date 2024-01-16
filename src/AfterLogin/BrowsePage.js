import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, Button, Tooltip, Snackbar } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";

export default function BrowsePage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const [snackBar, setSnackBar] = useState(null);
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

  const handleStudy = () => {
    navigate(`/study/${deckID}`);
  };

  useEffect(() => {
    const getDeckInfo = async () => {
      try {
        if (!deckID) {
          throw new Error("Page not found.");
        }
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
    getDeckInfo();
  }, [deckID, dbHandler]);

  const style = {
    py: 0,
    width: "100%",
    borderRadius: 2,
    borderColor: "divider",
    backgroundColor: "background.paper",
  };

  const cardsDisplay = cards.length
    ? cards.map((card, index) => {
        return (
          <Card className="browse-card" key={card.cardID}>
            <div className="browse-card-number">
              <p>{index + 1}</p>
            </div>
            <div className="browse-card-texts">
              <List sx={style}>
                <ListItem>
                  <ListItemText primary={card.english} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary={card.spanish} />
                </ListItem>
              </List>
            </div>
          </Card>
        );
      })
    : null;

  const handleSnackBar = (mode) => {
    switch (mode) {
      case "MixAndMatch":
        if (deck.deckCards.length < 10) {
          setSnackBar(10);
        } else {
          navigate(`/quiz/MixAndMatch/${deckID}`);
        }
      case "MC":
        if (deck.deckCards.length < 10) {
          setSnackBar(13);
        } else {
          navigate(`/quiz/MC/${deckID}`);
        }
    }
  };

  return (
    <div>
      <Snackbar
        open={!!snackBar}
        autoHideDuration={1000}
        onClose={() => setSnackBar(null)}
        message={
          !!snackBar &&
          `You need to have at least ${snackBar} cards to start this quiz.`
        }
      />
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      <div className="browse-card-layout">
        <h2>{deck.deckName}</h2>
      </div>
      <div>
        <Button
          fullWidth
          className="browse-flashcard-button"
          size="large"
          variant="contained"
          onClick={() => handleStudy()}
        >
          👩🏻‍💻Study Flashcard 💡
        </Button>
        <Button
          fullWidth
          className="browse-flashcard-quiz-button"
          size="large"
          variant="contained"
          onClick={() => handleSnackBar("MC")}
        >
          👩🏻‍💻Multiple Choice Quiz💡
        </Button>
        <Button
          fullWidth
          className="browse-flashcard-quiz-button"
          size="large"
          variant="contained"
          onClick={() => handleSnackBar("MixAndMatch")}
        >
          👩🏻‍💻Mix & Match Quiz💡
        </Button>
      </div>
      {<div>{cardsDisplay}</div>}
    </div>
  );
}
