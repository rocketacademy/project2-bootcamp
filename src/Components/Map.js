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
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
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
    date,
    displayAmount,
    displayCurrency
  ) => {
    setIsOpen(false);
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({
      id,
      amount,
      currency,
      category,
      description,
      date,
      displayAmount,
      displayCurrency,
    });
    setIsOpen(true);
  };

  // listens for changes to the highlighted state and triggers the handleMarkerClick function to open the infoWindow of highlighted expense
  useEffect(() => {
    if (expenses) {
      const highlightedExpense = expenses.find(
        (expense) => expense.id === highlighted
      );
      if (highlightedExpense) {
        const {
          id,
          lat,
          lng,
          amount,
          currency,
          category,
          description,
          date,
          displayAmount,
          displayCurrency,
        } = highlightedExpense;
        handleMarkerClick(
          id,
          lat,
          lng,
          amount,
          currency,
          category,
          description,
          date,
          displayAmount,
          displayCurrency
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
                  displayAmount,
                  displayCurrency,
                }) =>
                  displayAmount !== undefined && (
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
                          date,
                          displayAmount,
                          displayCurrency
                        );
                        setHighlighted(id);
                      }}
                      icon={
                        markerImages[getDollarAmountCategory(displayAmount)]
                      }
                    >
                      {/* if marker is clicked, isOpen is set to true and infoWindow is rendered with dollar amount */}
                      {isOpen && infoWindowData?.id === id && (
                        <InfoWindowF
                          position={{ lat, lng }}
                          onCloseClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <p>
                              <u>{`${infoWindowData.date}`}</u>
                              <br />
                              {`${infoWindowData.category}`}
                              {infoWindowData.description !== "-" ? (
                                <>
                                  <br /> {infoWindowData.description}
                                </>
                              ) : null}
                              <br />
                              {`${
                                infoWindowData.displayCurrency
                              } ${formatter.format(
                                infoWindowData.displayAmount
                              )}`}
                              {infoWindowData.currency !==
                              infoWindowData.displayCurrency
                                ? ` (${
                                    infoWindowData.currency
                                  }: ${formatter.format(
                                    infoWindowData.amount
                                  )})`
                                : null}
                            </p>
                          </div>
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
