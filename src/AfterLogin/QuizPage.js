import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state
import QuizFirstPage from "./QuizComponent/QuizFirstPage";

export default function QuizPage() {
  const [user, setUser] = useOutletContext();
  const [deck, setDeck] = useState(null);
  return <div>{!deck && <QuizFirstPage user={user} setDeck={setDeck} />}</div>;
}
