/* global google */

import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";
import "../App.css";

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
  userLocation,
  mapRef,
  setMapRef,
  expenses,
  isLoaded,
  formatter,
  highlighted,
  setHighlighted,
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

  // listens for changes to the highlighted state and triggers the handleMarkerClick function to open the infoWindow of highlighted expense
  useEffect(() => {
    if (expenses) {
      const highlightedExpense = expenses.find(
        (expense) => expense.id === highlighted
      );
      if (highlightedExpense) {
        const { id, lat, lng, amount, currency, category, description, date } =
          highlightedExpense;
        handleMarkerClick(
          id,
          lat,
          lng,
          amount,
          currency,
          category,
          description,
          date
        );
      } else {
        setIsOpen(false);
      }
    }
  }, [highlighted]);

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
          onClick={() => {
            setIsOpen(false);
            setHighlighted(null);
          }}
          center={center}
          zoom={12}
        >
          {/* code to render markers */}
          {uid !== ""
            ? expenses.map(
                ({
                  id,
                  lat,
                  lng,
                  amount,
                  currency,
                  category,
                  description,
                  date,
                }) => (
                  <MarkerF
                    key={id}
                    position={{ lat, lng }}
                    onClick={() => {
                      handleMarkerClick(
                        id,
                        lat,
                        lng,
                        amount,
                        currency,
                        category,
                        description,
                        date
                      );
                      setHighlighted(id);
                    }}
                    icon={markerImages[getDollarAmountCategory(amount)]}
                  >
                    {/* if marker is clicked, isOpen is set to true and infoWindow is rendered with dollar amount */}
                    {isOpen && infoWindowData?.id === id && (
                      <InfoWindowF
                        onCloseClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        <p>
                          <b>{`${infoWindowData.currency} ${formatter.format(
                            infoWindowData.amount
                          )} on ${infoWindowData.category}`}</b>
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
