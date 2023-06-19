import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";
// import { useState, useEffect } from "react";

// const libraries = ["places"];

export default function MapExpenses({ isLoggedIn, uid }) {
  console.log(isLoggedIn);
  console.log(uid);

  return (
    <div>
      {" "}
      {isLoggedIn ? (
        <div className="App">
          <Map uid={uid} />
          <ListExpenses uid={uid} />
        </div>
      ) : (
        <div className="App">
          <Map />
          <Welcome />
        </div>
      )}
    </div>
  );
}
