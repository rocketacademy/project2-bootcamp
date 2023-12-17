import React, { useState, useContext, useEffect } from "react";
import "../App.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import NewTrip from "../components/NewTrip";
import PastTrips from "../components/PastTrips";
import { TripContext } from "../Provider/TripProvider.js";
import CurrentTrip from "../components/CurrentTrip";

export default function Create() {

  // const [showPastTrips, setShowPastTrips] = useState(false);
  const { setDate, setTitle, showPastTrips, setShowPastTrips, 
    showNewTrip, setShowNewTrip, activeButton, setActiveButton,
  setShowCurrentTrip, showCurrentTrip, setIsTripCreated, setCurrentHiddenGemId } = useContext(TripContext);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setShowNewTrip(true); // Hide NewTrip component
    setShowPastTrips(false); // Hide PastTrips component
    setShowCurrentTrip(false); //Hide CurrenTrip component

    if (buttonId === 1) {
      // If the first button is clicked, show the NewTrip component
      setCurrentHiddenGemId("")
      setIsTripCreated(false)
      setShowNewTrip(true);
      setShowCurrentTrip(false)
      setDate({
        startDate: "",
        endDate: "",
      });
      setTitle("")
    }

    if (buttonId === 3) {
      // If the third button is clicked, show the PastTrips component
      setShowPastTrips(true);
      setShowCurrentTrip(false)
      setShowNewTrip(false)
    }
  };

  return (
    <div className="App">
      <Header />
      <div
        className="flex flex-col h-screen justify-center text-center content-center overflow-auto"
        style={{ height: "calc(100% - 128px)" }}
      >
        <div className="my-8">
          <button
            className={activeButton === 1 ? "btn btn-active" : "btn"}
            onClick={() => {
              handleButtonClick(1);
            }}
          >
            New Trip
          </button>
          <button
            className={activeButton === 3 ? "btn btn-active" : "btn"}
            onClick={() => handleButtonClick(3)}
          >
            Past Trips
          </button>
        </div>
        {showNewTrip && <NewTrip />}
        {showPastTrips && <PastTrips />}
        {showCurrentTrip && <CurrentTrip/>}
      </div>
      <Footer />
    </div>
  );
}


