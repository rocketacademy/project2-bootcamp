/* global google */

import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
import "../App.css";
import { realTimeDatabase } from "../firebase";
import { onValue, ref, off } from "firebase/database";

const DB_EXPENSES_FOLDER_NAME = "expenses";

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

export default function Map({
  uid,
  expenseCounter,
  userLocation,
  mapRef,
  setMapRef,
  expRef,
  expenses,
  setExpenses,
  isLoaded,
}) {
  // const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  // const [expenses, setExpenses] = useState([]);
  const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);

  // when map loads, determine the boundaries based on the location of the markers
  const onMapLoad = (map) => {
    setMapRef(map);
  };

  const getLatestExpLocation = () => {
    const array = Object.values(expenses);
    const lastItem = array[array.length - 1];
    const lat = lastItem.lat;
    const lng = lastItem.lng;
    const lastCenter = { lat, lng };
    return lastCenter;
  };

  // Retrieve expenses when the map is rendered
  // useEffect(() => {
  //   mapRef.panTo(getLatestExpLocation());

  //   // Clean up the listener when the component unmounts
  //   return () => {
  //     off(expRef);
  //     setExpenses([]);
  //   };
  // }, [uid, mapRef, expenseCounter]);

  // when a marker is clicked, pan the map to the marker location
  const handleMarkerClick = (
    id,
    lat,
    lng,
    amount,
    currency,
    category,
    description,
    date
  ) => {
    setIsOpen(false);
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, amount, currency, category, description, date });
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
          center={center}
          zoom={11}
        >
          {/* code to render markers */}
          {uid !== ""
            ? expenses.map(
                (
                  { lat, lng, amount, currency, category, description, date },
                  index
                ) => (
                  <MarkerF
                    key={index}
                    position={{ lat, lng }}
                    onClick={() => {
                      handleMarkerClick(
                        index,
                        lat,
                        lng,
                        amount,
                        currency,
                        category,
                        description,
                        date
                      );
                    }}
                    icon={markerImages[getDollarAmountCategory(amount)]}
                  >
                    {/* if marker is clicked, isOpen is set to true and infoWindow is rendered with dollar amount */}
                    {isOpen && infoWindowData?.id === index && (
                      <InfoWindowF
                        onCloseClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        <p>
                          {`${infoWindowData.currency} ${infoWindowData.amount} on ${infoWindowData.category}`}
                          <br />
                          <em>{`(${infoWindowData.date}: ${infoWindowData.description})`}</em>
                        </p>
                      </InfoWindowF>
                    )}
                  </MarkerF>
                )
              )
            : null}
          <MarkerF position={userLocation}></MarkerF>
        </GoogleMap>
      )}
    </div>
  );
}
