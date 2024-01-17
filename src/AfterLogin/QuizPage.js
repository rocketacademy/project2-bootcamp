import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPageMC from "./QuizComponent/MC/QuizFirstPageMC";
import McQuiz from "./QuizComponent/MC/McQuiz";
import "./QuizComponent/QuizPage.css";
import QuizFirstPageMixAndMatch from "./QuizComponent/MixAndMatch/QuizFirstPageMixAndMatch";
import MixAndMatchQuiz from "./QuizComponent/MixAndMatch/MixAndMatchQuiz";
import DBHandler from "../Controller/DBHandler";
import ErrorPage from "../ErrorPage";

export default function QuizPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [userDecks, setUserDecks] = useState(null);
  const [quizMode, setQuizMode] = useState("MC");
  const [quizPage, setQuizPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { mode, deckID } = useParams();
  const navi = useNavigate();
  const dbHandler = useMemo(
    () => new DBHandler(user.uid, setErrorMessage),
    [user.uid, setErrorMessage]
  );

  const handleErrorMessage = () => {
    setErrorMessage("");
    navi("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { userDecks } = await dbHandler.getUserAndDecksInfo();
        setUserDecks(userDecks);
        if (mode && deckID) {
          const targetDeckIndex = userDecks.findIndex(
            (deck) => deck.deckID === deckID
          );
          setDecks([userDecks[targetDeckIndex]]);
          setQuizMode(mode);
          setQuizPage(true);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [deckID, mode, dbHandler]);

  let modeDisplay;
  switch (quizMode) {
    case "MC":
      modeDisplay = quizPage ? (
        <McQuiz user={user} decks={decks} />
      ) : (
        <QuizFirstPageMC
          user={user}
          decks={decks}
          userDecks={userDecks}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
          quizMode={quizMode}
          setQuizMode={setQuizMode}
        />
      );
      break;

    case "MixAndMatch":
      modeDisplay = quizPage ? (
        <MixAndMatchQuiz user={user} decks={decks} />
      ) : (
        <QuizFirstPageMixAndMatch
          user={user}
          decks={decks}
          userDecks={userDecks}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
          quizMode={quizMode}
          setQuizMode={setQuizMode}
        />
      );
      break;
    default:
      modeDisplay = <h1>Somethings went wrong!</h1>;
  }

  return (
    <div className="App">
      <ErrorPage
        errorMessage={errorMessage}
        handleErrorMessage={handleErrorMessage}
      />
      {modeDisplay}
    </div>
  );
}
