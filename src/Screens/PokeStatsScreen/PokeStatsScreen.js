import { useParams } from "react-router-dom";

const PokeStatsScreen = () => {
  const { pokeName } = useParams();
  return <h2>Poke Stats Screen for {pokeName}</h2>;
};

export default PokeStatsScreen;
