import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";

import Event from "../Components/Dates/Event.js";
import NavBar from "../Details/NavBar.js";
import dates from "../Images/LogosIcons/word-icon-dates.png";

export default function DatesPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center bg-background">
        <NavBar src={dates} />
        <main>
          <p>Insert Dates</p>
          <Event />
        </main>
      </div>
    </>
  );
}
