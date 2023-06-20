import React from "react";
import "./AuthForm.css";
import { Outlet } from "react-router-dom";

const Authform = () => {
  return (
    <div>
      <div className="split left">
        <div className="centered"></div>
      </div>

      <div className="split right">  
        <Outlet/>
      </div>
    </div>
  );
};

export default Authform;
