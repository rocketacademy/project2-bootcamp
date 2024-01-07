import { useState } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPageMC from "./QuizComponent/MC/QuizFirstPageMC";
import McQuiz from "./QuizComponent/MC/McQuiz";
import "./QuizComponent/QuizPage.css";
import QuizFirstPageMixAndMatch from "./QuizComponent/MixAndMatch/QuizFirstPageMixAndMatch";
import MixAndMatchQuiz from "./QuizComponent/MixAndMatch/MixAndMatchQuiz";
import { Button } from "@mui/material";

export default function QuizPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [quizMode, setQuizMode] = useState("MC");
  const [quizPage, setQuizPage] = useState(false);
  //false is the first page
  //true is the quiz page
  console.log(decks);
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

  return (
    <div className="App">
      <Button onClick={() => setQuizMode("MC")}>MC Quiz</Button>
      <Button onClick={() => setQuizMode("MixAndMatch")}>Mix&Match Quiz</Button>
      {modeDisplay}
    </div>
  );
}
