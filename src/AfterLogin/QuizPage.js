import { useState } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPage from "./QuizComponent/QuizFirstPage";
import McQuiz from "./QuizComponent/McQuiz";

export default function QuizPage() {
  const [user] = useOutletContext();
  const [decks, setDecks] = useState([]);
  const [quizPage, setQuizPage] = useState(0);
  //0 is the first page
  //1 is the quiz page
  //2 is the result page
  return (
    <div className="page">
      {!quizPage && (
        <QuizFirstPage
          user={user}
          decks={decks}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
        />
      )}
      {quizPage === 1 && <McQuiz decks={decks} />}
    </div>
  );
}
