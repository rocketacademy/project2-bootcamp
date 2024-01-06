import { useState } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPageMC from "./QuizComponent/QuizFirstPageMC";
import McQuiz from "./QuizComponent/McQuiz";
import "./QuizComponent/QuizPage.css";
import QuizFirstPageMixAndMatch from "./QuizComponent/QuizFirstPageMixAndMatch";
import MixAndMatchQuiz from "./QuizComponent/MixAndMatchQuiz";

export default function QuizPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [quizMode, setQuizMode] = useState("MC");
  const [quizPage, setQuizPage] = useState(false);
  //false is the first page
  //true is the quiz page

  let modeDisplay;
  switch (quizMode) {
    case "MC":
      modeDisplay = quizPage ? (
        <McQuiz user={user} decks={decks} />
      ) : (
        <QuizFirstPageMC
          user={user}
          decks={decks}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
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
          setDecks={setDecks}
          setQuizPage={setQuizPage}
        />
      );
      break;

    default:
      modeDisplay = <h1>Somethings went wrong!</h1>;
  }

  return <div className="App">{modeDisplay}</div>;
}
