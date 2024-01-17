import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "./Study.css";
import ErrorPage from "../ErrorPage";
import DBHandler from "../Controller/DBHandler";
import TextToSpeech from "../Controller/TextToSpeech";

export default function BrowsePage() {
  const [user] = useOutletContext();
  const [deck, setDecks] = useState({});
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [goHome, setGoHome] = useState(false);
  const navigate = useNavigate();
  const { deckID } = useParams();
  const [loadingAudio, setLoadingAudio] = useState(false);
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage, setGoHome),
    [user.uid, setErrorMessage, setGoHome]
  );
  const audioHandler = useMemo(
    () =>
      new TextToSpeech(
        setErrorMessage,
        setLoadingAudio,
        process.env.REACT_APP_OPENAI_KEY
      ),
    [setErrorMessage, setLoadingAudio]
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

  const handleEdit = () => {
    navigate(`/editDeck/${deckID}`);
  };

  const handlePlayAudio = async (word) => {
    try {
      setLoadingAudio(true);
      await audioHandler.playAudio(word);
    } catch (error) {
      setErrorMessage(error.message);
    }
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
                  <LoadingButton
                    loading={loadingAudio}
                    className="study-audio-loading"
                    onClick={() => {
                      handlePlayAudio(card.spanish);
                    }}
                  >
                    <VolumeUpIcon fontSize="small" />
                  </LoadingButton>
                </ListItem>
              </List>
            </div>
          </Card>
        );
      })
    : null;

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      <div className="browse-card-title">
        <h2>{deck.deckName}</h2>
        <Button value={deckID} onClick={(e) => handleEdit(e.value)}>
          <ModeEditIcon />
        </Button>
      </div>
      <div className="browse-card-button-layout">
        <Button
          fullWidth
          className="browse-flashcard-button"
          size="large"
          variant="contained"
          onClick={() => handleStudy()}
        >
          📖 Study Flashcard
        </Button>
        {deck.deckCards && deck.deckCards.length < 13 ? null : (
          <Button
            fullWidth
            className="browse-flashcard-button-blue"
            size="large"
            variant="contained"
            onClick={() => navigate(`/quiz/MC/${deckID}`)}
          >
            📝 Multiple Choice Quiz
          </Button>
        )}
        {deck.deckCards && deck.deckCards.length < 10 ? null : (
          <Button
            fullWidth
            className="browse-flashcard-button-blue"
            size="large"
            variant="contained"
            onClick={() => navigate(`/quiz/MixAndMatch/${deckID}`)}
          >
            📋Mix & Match Quiz
          </Button>
        )}
      </div>
      <br />
      <p className="browse-text">Terms in this set:</p>
      {<div>{cardsDisplay}</div>}
    </div>
  );
}
