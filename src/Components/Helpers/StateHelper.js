import { useContext } from "react";
import { UserContext } from "../../App.js";

/* State helper can be used to display global 
states anywhere in the app on the UI */

const StateHelper = () => {
  const context = useContext(UserContext);

  return (
    <div className="bg-white text-[9px]">
      <p className="font-bold">StateHelper:</p>
      {context.displayName && <p>Name: {context.displayName}</p>}
      {context.email && <p>Email: {context.email}</p>}
      {context.pairKey && <p>Pair Key: {context.pairKey}</p>}
      {context.isLoggedIn ? null : <p>Signed Out</p>}
    </div>
  );
};

export default StateHelper;
