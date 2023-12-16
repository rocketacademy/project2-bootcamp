import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function HomePage() {
  const [user, setUser] = useOutletContext();
  return <div>Hi, user.</div>;
}
