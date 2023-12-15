import { useOutletContext } from "react-router-dom";

export default function EditPage() {
  const [user, setUser] = useOutletContext();
  return <div>EditPage</div>;
}
