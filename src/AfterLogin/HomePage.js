import { useOutletContext } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useOutletContext();
  return <div>Hi, user.</div>;
}
