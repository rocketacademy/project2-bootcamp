import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";

export default function MapExpenses({ isLoggedIn, uid }) {
  console.log(isLoggedIn);
  console.log(uid);
  const [expenseCounter, setExpenseCounter] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's location and to recenter the map based on that location when map is rendered
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentLocation);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [expenseCounter]);

  return (
    <div>
      {" "}
      {isLoggedIn ? (
        <div className="App">
          <Map
            uid={uid}
            expenseCounter={expenseCounter}
            userLocation={userLocation}
          />
          <ListExpenses
            uid={uid}
            expenseCounter={expenseCounter}
            setExpenseCounter={setExpenseCounter}
            userLocation={userLocation}
          />
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
