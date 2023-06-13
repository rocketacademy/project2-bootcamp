import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "../App.css";

const Singapore = { lat: 1.3521, lng: 103.8198 };

const jsonData = [
  {
    location: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    dollarAmount: 5,
  },
  {
    location: {
      latitude: 1.2806,
      longitude: 103.8505,
    },
    dollarAmount: 50,
  },
  {
    location: {
      latitude: 1.2903,
      longitude: 103.8515,
    },
    dollarAmount: 500,
  },
  {
    location: {
      latitude: 1.3187,
      longitude: 103.8444,
    },
    dollarAmount: 5000,
  },
];

// paths to icons to mark expenses on the map
const markerImages = [
  "https://i.imgur.com/7cK1OS9.png",
  "https://i.imgur.com/WcjaOHE.png",
  "https://i.imgur.com/jdBvHmU.png",
  "https://i.imgur.com/Z83u9o9.png",
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
          {jsonData.map((item, index) => (
            <MarkerF
              key={index}
              position={{
                lat: item.location.latitude,
                lng: item.location.longitude,
              }}
              icon={markerImages[getDollarAmountCategory(item.dollarAmount)]}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
