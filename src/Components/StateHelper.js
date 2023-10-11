import { useContext } from "react";
import { UserContext } from "../App.js";

const StateHelper = () => {
  const context = useContext(UserContext);

  return (
    <div className="bg-white text-[10px]">
      <p className="font-bold">State helper:</p>
      <p>Pair Key: {context.pairKey}</p>
      {context.isLoggedIn ? <p>Signed In</p> : <p>Signed Out</p>}
      {context.isPairedUp ? <p>Paired Up</p> : <p>Not Paired</p>}
      {context.isDemo ? <p>Demo</p> : <p>Not Demo</p>}
    </div>
  );
};

export default StateHelper;
