/* global google */

import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
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

export default function Map() {
  // userLocation,
  // setUserLocation,
  // mapRef,
  // setMapRef
  // onMapLoad
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const [userLocation, setUserLocation] = useState(null);
  // const center = useMemo(() => Singapore, []);
  // const center = useMemo(() => userLocation, []);

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

  // when map loads, determine the boundaries based on the location of the markers
  const onMapLoad = (map) => {
    setMapRef(map);
    if (userLocation) {
      map.panTo(userLocation);
    } else {
      const bounds = new google.maps.LatLngBounds();
      markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
      map.fitBounds(bounds);
    }
  };

  // when a marker is clicked, pan the map to the marker location
  const handleMarkerClick = (id, lat, lng, dollarAmount) => {
    setIsOpen(false);
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, dollarAmount });
    setIsOpen(true);
  };

  return (
    <div className="map-container">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map"
          // hide the map and satellite overlay
          options={{ mapTypeControl: false }}
          onLoad={onMapLoad}
          // when map is clicked, change setIsOpen state to false
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
            >
              {/* if marker is clicked, isOpen is set to true and infoWindow is rendered with dollar amount */}
              {isOpen && infoWindowData?.id === index && (
                <InfoWindowF
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <h4>{infoWindowData.dollarAmount}</h4>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
          <MarkerF position={userLocation}></MarkerF>
        </GoogleMap>
      )}
    </div>
  );
}
