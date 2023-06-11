// File to contain 'AuthForm' items like user sign up, user log in
import NavBar from "./NavBar";
import "../App.css";

export default function AuthForm() {
  return (
    <div>
      {" "}
      <NavBar />
      <div className="temporary-box">Sign Up / Log In</div>
    </div>
  );
}
