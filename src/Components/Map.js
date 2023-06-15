/* global google */

import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useState, useMemo } from "react";
import "../App.css";

const Singapore = { lat: 1.3521, lng: 103.8198 };

// the json data which will be mapped out to render the markers
const jsonData = [
  {
    lat: 1.3521,
    lng: 103.8198,
    dollarAmount: 5,
  },
  {
    lat: 1.2806,
    lng: 103.8505,
    dollarAmount: 50,
  },
  {
    lat: 1.2903,
    lng: 103.8515,
    dollarAmount: 500,
  },
  {
    lat: 1.3187,
    lng: 103.8444,
    dollarAmount: 5000,
  },
];

// paths to icons to mark expenses on the map
const markerImages = [
  "https://i.imgur.com/ovmoJoo.png",
  "https://i.imgur.com/QSmFBIk.png",
  "https://i.imgur.com/DGO3ZQK.png",
  "https://i.imgur.com/6nLIyt6.png",
];

// function to assign an icon to display based on the dollar amount
function getDollarAmountCategory(dollarAmount) {
  if (dollarAmount < 10) return 0;
  if (dollarAmount < 100) return 1;
  if (dollarAmount < 1000) return 2;
  return 3;
}

const onLoad = (map) => {
  const bounds = new google.maps.LatLngBounds();
  jsonData?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
  map.fitBounds(bounds);
};

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
        <GoogleMap
          mapContainerClassName="map"
          options={{ mapTypeControl: false }}
          onLoad={onLoad}
        >
          {/* center={center} zoom={11} */}
          {jsonData.map((item, index) => (
            <MarkerF
              key={index}
              position={{
                lat: item.lat,
                lng: item.lng,
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
