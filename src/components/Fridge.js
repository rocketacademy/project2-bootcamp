import React, { useState } from "react";
import "./Fridge.css";

const Fridge = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseHover = () => {
    setIsHovering((prevState) => !prevState);
  };

  const gifStyle = {
    position: "absolute",
    top: 50,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.7,
    display: isHovering ? "block" : "none",
  };

  return (
    <div className="door-container">
      <div
        className="door"
        onMouseEnter={handleMouseHover}
        onMouseLeave={handleMouseHover}
      >
        <div className="door-front"></div>
        <div className="door-back">
          <div style={gifStyle}>
            <img
              src="https://tenor.com/en-SG/view/fridge-dissapointed-no-food-my-excitement-for-food-is-now-gone-oh-nevermind-gif-17411460.gif"
              alt="Disappointed Fridge"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fridge;
