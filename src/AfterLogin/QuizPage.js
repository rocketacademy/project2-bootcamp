import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function QuizPage() {
  const [user, setUser] = useOutletContext();
  return <div>QuizPage</div>;
}
