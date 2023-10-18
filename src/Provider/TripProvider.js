// Make a provider file 
import {useState, createContext } from "react";

export const TripContext = createContext();

export default function TripProvider({children}) {

  const [title, setTitle] = useState("");
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [isTripCreated, setIsTripCreated] = useState(false);
  const [trips, setTrips] = useState([]);
  const [showPastTrips, setShowPastTrips] = useState(false);
  const [showNewTrip, setShowNewTrip] = useState(true);
  const [activeButton, setActiveButton] = useState(1);


  return (
      <TripContext.Provider value={{title, setTitle, date, setDate, 
      isTripCreated, setIsTripCreated, trips, setTrips, showPastTrips, setShowPastTrips,
      showNewTrip, setShowNewTrip, setActiveButton, activeButton}}>
        {children}
      </TripContext.Provider>
  );

}