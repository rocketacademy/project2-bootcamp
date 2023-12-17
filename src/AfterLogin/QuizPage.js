import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPage from "./QuizComponent/QuizFirstPage";

export default function QuizPage() {
  const [user, setUser] = useOutletContext();
  const [decks, setDecks] = useState({});
  const [quizPage, setQuizPage] = useState(0);
  return (
    <div>
      {!quizPage && (
        <QuizFirstPage
          user={user}
          setDecks={setDecks}
          setQuizPage={setQuizPage}
        />
      )}
    </div>
  );
}
