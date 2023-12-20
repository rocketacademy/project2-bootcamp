import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 1.35313, // default latitude
  lng: 103.81404, // default longitude
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        mapId="6da2495ffc989dca"
        zoom={12}
        center={center}
      >
        <Marker position={center} />
        <Marker
          position={{ lat: 1.40058, lng: 103.90899 }}
          onClick={() => {
            console.log("Marker clicked!");
            //TODO: Insert OpenAI API call here
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default App;
