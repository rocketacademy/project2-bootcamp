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
const markers = [
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

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindow, setInfoWindow] = useState();
  const center = useMemo(() => Singapore, []);

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id, lat, lng, dollarAmount) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindow({ id, dollarAmount });
    setIsOpen(true);
  };

  return (
    <div className="map-container">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map"
          options={{ mapTypeControl: false }}
          onLoad={onMapLoad}
          onClick={() => setIsOpen(false)}
        >
          {/* code to render markers */}
          {markers.map(({ lat, lng, dollarAmount }, index) => (
            <MarkerF
              key={index}
              position={{ lat, lng }}
              onClick={() => {
                handleMarkerClick(index, lat, lng, dollarAmount);
              }}
              icon={markerImages[getDollarAmountCategory(dollarAmount)]}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
