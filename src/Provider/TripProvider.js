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
  const [addedGems, setAddedGems] = useState(undefined);
  const [currentHiddenGemId, setCurrentHiddenGemId] = useState("")
  const [key, setKey] = useState("")
  const [showCurrentTrip, setShowCurrentTrip] = useState(false)

  return (
    <TripContext.Provider
      value={{
        title,
        setTitle,
        date,
        setDate,
        isTripCreated,
        setIsTripCreated,
        trips,
        setTrips,
        showPastTrips,
        setShowPastTrips,
        showNewTrip,
        setShowNewTrip,
        setActiveButton,
        activeButton,
        addedGems,
        setAddedGems,
        currentHiddenGemId,
        setCurrentHiddenGemId,
        key,
        setKey,
        showCurrentTrip,
        setShowCurrentTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );

}