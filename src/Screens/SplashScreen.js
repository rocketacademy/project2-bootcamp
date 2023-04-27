import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  return (
    <div>
      <header className="App-header">
        <h1>Poké App</h1>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
          alt="POKEMON"
        />
        <button onClick={handleNavigate} id="login">
          Login
        </button>
        <button onClick={handleNavigate} id="signup">
          Sign Up
        </button>
      </header>
    </div>
  );
};

export default SplashScreen;
