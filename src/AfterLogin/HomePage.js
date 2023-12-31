import { useOutletContext } from "react-router-dom";
import { auth } from "../firebase";

//Take the user data from App.js state

export default function HomePage() {
  const [user, setUser] = useOutletContext();

  return (
    <div>
      Hi, {auth.currentUser.displayName ? auth.currentUser.displayName : "user"}
      .
    </div>
  );
}
