import { useState } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPage from "./QuizComponent/QuizFirstPage";
import McQuiz from "./QuizComponent/McQuiz";
import "./QuizComponent/QuizPage.css";

export default function QuizPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [quizPage, setQuizPage] = useState(false);
  //false is the first page
  //true is the quiz page
  return (
    <div className="App">
      {quizPage ? (
        <McQuiz user={user} decks={decks} />
      ) : (
        <QuizFirstPage
          user={user}
          decks={decks}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
        />
      )}
    </div>
  );
}
