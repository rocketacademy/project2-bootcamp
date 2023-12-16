import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function StudyPage() {
  const [user, setUser] = useOutletContext();
  return <div>StudyPage</div>;
}
