// File to contain 'Profile' items like edit and update name, profile picture, email address, bio, etc

import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";

export default function MapExpenses() {
  return (
    <div>
      {" "}
      <div className="App">
        <Map />
        <ListExpenses />
      </div>
      {/* {isLoggedIn ? (
        <div className="App">
          <Map />
          <ListExpenses />
        </div>
      ) : (
        <div className="App">
          <Map />
          <Welcome />
        </div>
      )} */}
    </div>
  );
}
