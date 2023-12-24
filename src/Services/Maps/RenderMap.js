import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const libraries = ["places"];
const mapContainerStyle = {
  width: "80vw",
  height: "80vh",
};
const center = {
  lat: 1.3513,
  lng: 103.81404,
};

const RenderMap = ({ sendMessage }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const onMapClick = useCallback((event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latLng.lat()},${event.latLng.lng()}
        &key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY},
        result_type=street_address`
      )
      .then((res) => console.log(res))
      .then((res) =>
        sendMessage(
          `What is the name of this location with the following address:${res}. Share with me its history, and what developments occured in the last 20 years in Singapore. Word limit is 30 words.`
        )
      );
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      mapId="6da2495ffc989dca"
      zoom={12}
      center={center}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  );
};

export default RenderMap;
