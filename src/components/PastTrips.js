import { database } from "../firebase.js";
import { ref, onChildAdded, set, get } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { TripContext } from "../Provider/TripProvider.js";
import { UserContext } from "../App";
import CurrentTrip from "./CurrentTrip.js";
import "./PastTrips.css"

const DB_TRIPS_KEY = "trips";

export default function PastTrips({ onPastTripClick }) {
  const [currentData, setCurrentData] = useState(null)
  const [currentKey, setCurrentKey] = useState(null);

  const {
    setDate,
    setTitle,
    trips,
    setTrips,
    setIsTripCreated,
    currentHiddenGemId,
    setCurrentHiddenGemId,
    setAddedGems,
    addedGems,
    key,
    setKey,
    setShowCurrentTrip,
    setShowPastTrips
  } = useContext(TripContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const tripsRef = ref(database, DB_TRIPS_KEY);
      setTrips([]);

      const unmount = onChildAdded(tripsRef, (data) => {
        const tripData = { key: data.key, val: data.val() };

        if (tripData.val.userId === user.uid) {
          setTrips((prevTrips) => [tripData, ...prevTrips]);
        }
      });
      return () => unmount()
    }
  }, [setTrips, user]);

  const handleClick = (oldTrip) => {

    const tripKey = oldTrip.key;
    const tripRef = ref(database, `${DB_TRIPS_KEY}/${tripKey}`);

    get(tripRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const tripData = snapshot.val();
          setCurrentData(tripData)
          setCurrentKey(tripKey)
          setKey(tripKey)
          console.log("This is the tripData", tripData)
          console.log("This is the tripKey", tripKey)
          const { title, startDate, endDate, addedGems: existingAddedGems = [] } = tripData;
          console.log("Existing", existingAddedGems)
          setAddedGems(existingAddedGems)
          setTitle(title);
          console.log("THe title is", title)
          setDate({
            startDate: startDate,
            endDate: endDate,
          });
          console.log("THe date is", startDate);

          console.log("Hem is", currentHiddenGemId)
          if (currentHiddenGemId !== "") {
            const updatedGems = [...existingAddedGems, currentHiddenGemId]
            setAddedGems(updatedGems);
            console.log("These are the new addedGems", updatedGems)
            setCurrentHiddenGemId("");
          } 

          setShowCurrentTrip(true)
          setShowPastTrips(false)

        } else {
          console.error("Trip not found.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving trip details:", error);
      });
    }

    useEffect(() => {
      console.log(currentKey, addedGems)
      if (addedGems && currentKey) {
        // console.log(currentKey)
        console.log("Updating database with:", addedGems);
        const tripRef = ref(database, `${DB_TRIPS_KEY}/${currentKey}`);
          console.log(addedGems);
          set(tripRef, { ...currentData, addedGems: addedGems });
          setIsTripCreated(true);
          onPastTripClick();
      }
    }, [addedGems])

    const handleRemoveTrip = async (tripKey) => {
      if (tripKey) {
        const tripRef = ref(database, `${DB_TRIPS_KEY}/${tripKey}`);
        try {
          await set(tripRef, null); 
          setTrips((prevTrips) =>
            prevTrips.filter((trip) => trip.key !== tripKey)
          ); 
          console.log("Trip removed successfully");
        } catch (error) {
          console.error("Error removing trip:", error);
        }
      } else {
        console.error("No trip key available for removal");
      }
    };

  return (
    <div className="join join-vertical button-container">
      {trips.map((trip) => (
        <div key={trip.key} className="my-2">
          <button
            className="btn bg-red-500 text-white px-2 h-2 mr-2"
            onClick={() => handleRemoveTrip(trip.key)}
          >
            X
          </button>
          <button className="btn px-4 py-2" onClick={() => handleClick(trip)}>
            {trip.val && trip.val.title ? `${trip.val.title} +` : ""}
          </button>
        </div>
      ))}
    </div>
  );
}
