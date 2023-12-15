import { useNavigate } from "react-router-dom";

// need to add logic to Register with firebase auth
export default function RegisterPage(props) {
  const navi = useNavigate();

  return (
    <div className="App">
      <button onClick={() => navi("/")}>Register</button>
    </div>
  );
}
