import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";

export default function MapExpenses({ isLoggedIn }) {
  return (
    <div>
      {" "}
      {isLoggedIn ? (
        <div className="App">
          <Map />
          <ListExpenses />
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
