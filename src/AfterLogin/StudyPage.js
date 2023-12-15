import { useOutletContext } from "react-router-dom";
export default function StudyPage() {
  const [user, setUser] = useOutletContext();
  return <div>StudyPage</div>;
}
