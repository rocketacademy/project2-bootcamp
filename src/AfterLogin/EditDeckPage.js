import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function EditdeckPage() {
  const [user, setUser] = useOutletContext();
  return <div>EditDeckPage</div>;
}
