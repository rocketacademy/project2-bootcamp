import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "../App.css";

// process.env.GOOGLE_MAPS_API_KEY;

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCWVkzUWjah6IyXhaw46_L_5nt5k6YQOxc",
  });
  const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);

  return (
    <div className="map-container">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap mapContainerClassName="map" center={center} zoom={11} />
      )}
    </div>
  );
};

export default Map;
