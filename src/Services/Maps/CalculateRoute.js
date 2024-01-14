import React, { useCallback, useRef } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
} from "@react-google-maps/api";
import axios from "axios";

export default function calculateRoute() {
  const directionsServiceRef = useRef();
  const directionsRendererRef = useRef();
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapRef.current);
  }, []);

  const onDirectionsServiceLoad = useCallback((directionsService) => {
    directionsServiceRef.current = directionsService;
  }, []);

  const onDirectionsRendererLoad = useCallback((directionsRenderer) => {
    directionsRendererRef.current = directionsRenderer;
  }, []);

  const calculateRoute = (userStartLocation, userEndLocation) => {
    const start = userStartLocation;
    const end = userEndLocation;

    if (directionsServiceRef.current) {
      directionsServiceRef.current.route(
        {
          origin: start,
          destination: end,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            if (directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(result);
            }
          } else {
            console.log(`error`);
          }
        }
      );
    }
  };

  return (
    <GoogleMap>
      <DirectionsService
        options={{
          origin: "start location",
          destination: "end location",
          travelMode: "DRIVING",
        }}
        onLoad={onDirectionsServiceLoad}
      />
      <DirectionsRenderer onLoad={onDirectionsRendererLoad} />
    </GoogleMap>
  );
}
