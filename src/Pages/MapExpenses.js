import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { get, onValue, off, ref, update } from "firebase/database";
import { useLoadScript } from "@react-google-maps/api";

const DB_EXPENSES_FOLDER_NAME = "expenses";
const DB_USERS_FOLDER_NAME = "user";

export default function MapExpenses({ isLoggedIn, uid, userData }) {
  console.log(isLoggedIn);
  console.log(uid);
  const [expenseCounter, setExpenseCounter] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [mapRef, setMapRef] = useState();
  const [expRef, setExpRef] = useState();
  const [highlighted, setHighlighted] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState("SGD");

  // Get user's location and assign coordinates to states
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentLocation);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [expenseCounter]);

  // updates expenses array with each additional expense
  useEffect(() => {
    const expRef = ref(realTimeDatabase, `${DB_EXPENSES_FOLDER_NAME}/${uid}`);

    const listener = onValue(
      expRef,
      (snapshot) => {
        const expensesData = snapshot.val();
        if (expensesData) {
          const expensesArray = Object.entries(expensesData).map(
            ([key, value]) => ({
              id: key,
              ...value,
            })
          );
          console.log(expensesArray);
          setExpenses(expensesArray);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      off(expRef, listener);
      setExpenses([]);
    };
  }, [uid, mapRef, expenseCounter]);

  // useEffect to fetch from the database and update the displayCurrency state
  useEffect(() => {
    if (userData && userData.displayCurrency) {
      setDisplayCurrency(userData.displayCurrency);
    }
  }, [userData]);

  // useEffect to update the displayCurrency in the database
  useEffect(() => {
    const userRef = ref(realTimeDatabase, `${DB_USERS_FOLDER_NAME}/${uid}`);
    update(userRef, { displayCurrency: displayCurrency });
  }, [displayCurrency]);

  // create isLoaded variable and assign it the results of useLoadScript + google maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  // function to format numbers to the decimal format i.e., add a comma for every thousand and decimal places if applicable
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  // function to handle when an expense is selected - pushes expenseId into the state
  const handleOnSelect = (expense) => {
    if (highlighted === expense.id) {
      setHighlighted(null);
    } else {
      setHighlighted(expense.id);
      console.log(highlighted);
    }
  };

  return (
    <div>
      {" "}
      {isLoggedIn ? (
        <div className="App">
          <Map
            uid={uid}
            expenseCounter={expenseCounter}
            userLocation={userLocation}
            expenses={expenses}
            setExpenses={setExpenses}
            mapRef={mapRef}
            setMapRef={setMapRef}
            expRef={expRef}
            isLoaded={isLoaded}
            formatter={formatter}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            isLoading={isLoading}
          />
          <ListExpenses
            uid={uid}
            mapRef={mapRef}
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            expenseCounter={expenseCounter}
            setExpenseCounter={setExpenseCounter}
            userLocation={userLocation}
            expenses={expenses}
            setExpenses={setExpenses}
            formatter={formatter}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleOnSelect={handleOnSelect}
            isLoading={isLoading}
            displayCurrency={displayCurrency}
            setDisplayCurrency={setDisplayCurrency}
          />
        </div>
      ) : (
        <div className="App">
          <Map
            uid={uid}
            mapRef={mapRef}
            setMapRef={setMapRef}
            isLoaded={isLoaded}
            userLocation={userLocation}
          />
          <Welcome />
        </div>
      )}
    </div>
  );
}
