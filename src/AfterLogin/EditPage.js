import { useOutletContext } from "react-router-dom";
//Take the user data from App.js state

export default function EditPage() {
  const [user, setUser] = useOutletContext();
  return <div>EditPage</div>;
}
