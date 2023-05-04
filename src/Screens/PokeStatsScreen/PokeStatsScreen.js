import { useContext } from "react";
import { useParams } from "react-router-dom";
import { NavContext, UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./PokeStatsScreen.css";

const PokeStatsScreen = ({ topten, wishlist }) => {
  const { link } = useParams();
  const { handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const linkBreakdown = link.split("-");
  const listName = linkBreakdown[0];
  const pokeName = linkBreakdown[1];
  let pokeData;
  if (listName === "topten") {
    pokeData = topten[pokeName];
  } else if (listName === "wishlist") {
    pokeData = wishlist[pokeName];
  }
  let typeList = pokeData.type.map((type) => (
    <div className={`poke-type ${type}`}>{type}</div>
  ));
  return (
    <header className="App-header">
      <div id="poke-stats">
        <button onClick={handleNavigate} id="">
          Back
        </button>
        <h1>
          {listName === "topten" && `${user.name}'s `}
          {pokeName}
        </h1>
        <img className={pokeData.type} src={pokeData.imgURL} alt={pokeName} />
        <div className="poke-types">{typeList}</div>
      </div>
      <NavBar />
    </header>
  );
};

export default PokeStatsScreen;
