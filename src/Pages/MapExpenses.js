import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";

// const libraries = ["places"];

export default function MapExpenses({ isLoggedIn, uid }) {
  console.log(isLoggedIn);
  console.log(uid);

  const [userLocation, setUserLocation] = useState(null);
  const [mapRef, setMapRef] = useState();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentLocation);
          if (mapRef) {
            mapRef.panTo(currentLocation);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [mapRef]);

  const onMapLoad = (map) => {
    setMapRef(map);
    if (userLocation) {
      map.panTo(userLocation);
    }
  };

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
