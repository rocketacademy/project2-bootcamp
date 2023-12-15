import { useOutletContext } from "react-router-dom";

export default function QuizPage() {
  const [user, setUser] = useOutletContext();
  return <div>QuizPage</div>;
}
