import { useEffect, useContext, useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { database } from "../firebase.js";
import { ref, push, onChildAdded, set } from "firebase/database";
import {TripContext} from "../Provider/TripProvider.js";
import { UserContext } from "../App";
import CurrentTrip from "./CurrentTrip.js";
import "./NewTrip.css"

const DB_TRIPS_KEY = "trips";

export default function NewTrip() {

  const [isFormValid, setIsFormValid] = useState(false);

  const { date, setDate, setTitle, title, setIsTripCreated, isTripCreated, setTrips, key, setKey, addedGems, setAddedGems, trips, currentHiddenGemId, showNewTrip, setShowNewTrip } =
    useContext(TripContext);
  const { user } = useContext(UserContext);

  const validateForm = () => {
    setIsFormValid(
      title !== "" && date.startDate !== null && date.endDate !== null
    );
  };

  useEffect(() => {
    validateForm();
  }, [title, date.startDate, date.endDate]);

  useEffect(() => {
    const tripsRef = ref(database, DB_TRIPS_KEY);
    onChildAdded(tripsRef, (data) => {
      // const trip = data
      const tripData = { key: data.key, val: data.val() }
      if (tripData.val.userId === user.uid) {
        setTrips((prevTrips) => {
        if (prevTrips.some(trip => trip.key === data.key)) {
          return prevTrips 
        } return [
          ...prevTrips, tripData
        ]})
      }
    });
  }, [setTrips, user]);

  const writeData = (trip) => {
    console.log(trip)
    const tripListRef = ref(database, DB_TRIPS_KEY);
    // const newTripRef = push(tripListRef);
    // set(newTripRef, trip);
    push(tripListRef, trip).then((data) => {setKey(data.key); console.log(key)})

    console.log("This is the key", key);
  };

  const handleChange = (event) => {
    const name = event.target.id;
    const value = event.target.value;
    if (name === "Title") {
      setTitle(value);
    }
  };

  const handleValueChange = (newValue) => {
    setDate(newValue);
  };

  

  const submit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      const newTrip = {
        title,
        startDate: date.startDate,
        endDate: date.endDate,
        userId: user.uid,
        addedGems: addedGems || [],
      };
      console.log(addedGems);
      console.log(newTrip);
      writeData(newTrip);
      setTrips((prevTrips) => [...prevTrips, newTrip]);
      if (currentHiddenGemId === "") {
        setAddedGems([])
      }
      setIsTripCreated(true);
    }
  };

  return (
    <div>
      {isTripCreated ? (
        <CurrentTrip />
      ) : (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold">Create New Trip List</h1>
              <p className="py-2"></p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mb-12">
              <form className="card-body p-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title:</span>
                  </label>
                  <input
                    type="Title"
                    id="Title"
                    placeholder="Title"
                    className="input input-bordered"
                    required
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <label className="label">
                  <span className="label-text">Date:</span>
                </label>
                <Datepicker value={date} onChange={handleValueChange} />
                <div className="form-control mt-6">
                  <button
                    className="btn btn-primary"
                    onClick={submit}
                    disabled={!isFormValid}
                  >
                    Create New Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
