import {
  withGoogleMap,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useMemo } from "react";
import "../App.css";

const Singapore = { lat: 1.3521, lng: 103.8198 };

// paths to icons to mark expenses on the map
const markerImages = [
  "project2-bootcamp/src/Icons/coin_1fa99.png",
  "project2-bootcamp/src/Icons/dollar-banknote_1f4b5.png",
  "project2-bootcamp/src/Icons/money-bag_1f4b0.png",
  "",
  "project2-bootcamp/src/Icons/money-bag_1f4b0.png",
  "",
];

function getDollarAmountCategory(dollarAmount) {
  if (dollarAmount < 10) return 0;
  if (dollarAmount < 100) return 1;
  if (dollarAmount < 1000) return 2;
  return 3;
}

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const center = useMemo(() => Singapore, []);

  return (
    <div className="map-container">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap mapContainerClassName="map" center={center} zoom={11}>
          <Marker
            position={Singapore}
            icon={"project2-bootcamp/src/Icons/money-bag_1f4b0.png"}
          />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
