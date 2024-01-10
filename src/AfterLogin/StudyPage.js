import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { storage, database } from "../firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { Card, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Backdrop, CircularProgress } from "@mui/material";
import StudyDone from "./StudyComponent/StudyDone";
import "./Study.css";
import ErrorPage from "../ErrorPage";

export default function StudyPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [studyDone, setStudyDone] = useState(false);
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
        console.log(userDeckIDs);
        if (!userDeckIDs.length || !userDeckIDs.includes(Number(deckID))) {
          throw new Error("You don't have this deck!");
        }
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };
    checkUserDeckID();
    const takeDecksInfo = async () => {
      try {
        const decksRef = ref(database, `decks/deck${deckID}`);
        return await get(decksRef);
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };

    const takeCardsInfo = async (cardNumber) => {
      try {
        const cardsRef = ref(database, `cards/card${cardNumber}`);
        return await get(cardsRef);
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };

    const fetchDeckAndCards = async () => {
      try {
        const deckInfo = await takeDecksInfo();
        const deckInfoData = deckInfo.val();

        if (deckInfoData) {
          const cardNumber = Object.values(deckInfoData.deckCards);
          const cardPromises = cardNumber.map((cardID) =>
            takeCardsInfo(cardID)
          );
          const cardInfo = await Promise.all(cardPromises);
          const cardInfoData = cardInfo.map((number) => number.val());

          setDecks(deckInfoData);
          setCards(cardInfoData);
        }
      } catch (error) {
        setGoHome(true);
        setErrorMessage(error.message);
      }
    };
    fetchDeckAndCards();
  }, [deckID]);

  const handleNextCard = () => {
    if (currentIndex < Object.keys(decks.deckCards).length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDisplayEnglish(true);
    } else {
      setStudyDone(true);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDisplayEnglish(true);
    }
  };

  const handleClick = () => {
    setDisplayEnglish((prevDisplayEnglish) => !prevDisplayEnglish);
  };

  const handleCloseStudyDone = () => {
    setStudyDone(false);
    navigate(`/`);
  };

  const handleShuffle = () => {
    setCards((prev) => {
      for (let i = 0; i < prev.length; i++) {
        let temp = cards[i];
        let randomIndex = Math.floor(Math.random() * prev.length);
        cards[i] = cards[randomIndex];
        cards[randomIndex] = temp;
      }
      return [...prev];
    });
  };

  const STORAGE_KEY = "audio/";

  const playAudio = async () => {
    //make sure file name doesn't have whitespace, if have replace with _
    const fileName = currentCard.spanish.replace(/\s+/g, "_").toLowerCase();
    try {
      const audioRef = storageRef(storage, `${STORAGE_KEY}/${fileName}.mp3`);
      const audioUrl = await getDownloadURL(audioRef);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const currentCard = decks.deckCards && cards[currentIndex];

  const totalCards = decks.deckCards ? Object.keys(decks.deckCards).length : 0;

  const progressBar = ({ current, total }) => {
    const progress = (current / total) * 100;
    return (
      <LinearProgress
        variant="determinate"
        value={progress}
        color="error"
        sx={{ marginBottom: 2 }}
      />
    );
  };

  const deckName = decks.deckName;

  return (
    <div>
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      <Backdrop open={!decks.deckCards}>
        <h3>Generating deck</h3>
        <h1>
          <CircularProgress color="inherit" />
        </h1>
      </Backdrop>
      {decks.deckCards && Object.keys(decks.deckCards).length > 0 && (
        <>
          <div className="study-header">
            <p>{deckName}</p>
            <div className="shuffle-quiz">
              <Button onClick={handleShuffle}>Shuffle</Button>
            </div>
          </div>
          <p className="current-index">
            {currentIndex + 1}/{totalCards}
          </p>
          {progressBar({ current: currentIndex + 1, total: totalCards })}
          <Card className="study-card">
            {displayEnglish ? (
              <>
                <div className="study-card-header">
                  <p>English</p>
                </div>
                <div className="study-word" onClick={handleClick}>
                  <h1>{currentCard.english}</h1>
                </div>
                <p className="hint">Hint: Tap to flip to the other side</p>
              </>
            ) : (
              <>
                <div className="study-card-header">
                  <p>Spanish</p>
                  <Button onClick={playAudio}>Audio</Button>
                </div>
                <div className="study-word" onClick={handleClick}>
                  <h1>{currentCard.spanish}</h1>
                </div>
                <p className="hint">Hint: Tap to flip to the other side</p>
              </>
            )}
          </Card>
          <div className="prev-next">
            <Button onClick={handlePrevCard} disabled={currentIndex <= 0}>
              Prev
            </Button>
            <Button onClick={handleNextCard}>
              {currentIndex === totalCards - 1 ? "Done" : "Next"}
            </Button>
          </div>
        </>
      )}

      {/* showing dialog after reviewing done */}
      {studyDone && (
        <StudyDone open={studyDone} onClose={handleCloseStudyDone} />
      )}
    </div>
  );
}
