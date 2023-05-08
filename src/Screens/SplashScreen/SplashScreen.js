import { NavContext } from "../../App";
import { useContext } from "react";
import "./SplashScreen.css";

const SplashScreen = () => {
  const { handleNavigate } = useContext(NavContext);

  return (
    <div id="splash" className="contents">
      <h1>Poké Rank</h1>
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
        alt="POKEMON"
      />
      <div className="buttons">
        <button onClick={handleNavigate} id="login">
          Login
        </button>
        <button onClick={handleNavigate} id="signup">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
