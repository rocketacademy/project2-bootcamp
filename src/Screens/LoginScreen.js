import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useContext, useState } from "react";
import { NavContext } from "../App";

const LoginScreen = () => {
  const { navigate, handleNavigate } = useContext(NavContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then(() => {
      navigate("/profile");
    });
  };

  return (
    <div>
      <header className="App-header">
        <button onClick={handleNavigate} id="">
          Back
        </button>
        <h1>Login</h1>
        <form>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button onClick={handleSubmit} id="login">
            Login
          </button>
        </form>
        <p>Don't have an account?</p>
        <button onClick={handleNavigate} id="signup">
          Sign Up
        </button>
      </header>
    </div>
  );
};

export default LoginScreen;
