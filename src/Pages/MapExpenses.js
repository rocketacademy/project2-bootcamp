import "../App.css";
import Map from "../Components/Map";
import ListExpenses from "../Components/ListExpenses";
import Welcome from "./Welcome";
import { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { get, onValue, off, ref, update, remove } from "firebase/database";
import { useLoadScript } from "@react-google-maps/api";
import { Toast } from "react-bootstrap";

const DB_EXPENSES_FOLDER_NAME = "expenses";
const DB_USERS_FOLDER_NAME = "user";

export default function MapExpenses({
  isLoggedIn,
  uid,
  userData,
  currenciesList,
}) {
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
  const [showToast, setShowToast] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);

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

  // Fetches latest expenses array, triggered with every additional expense
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
          setReadyToShow(true);
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

  // Fetches displayCurrency from the database and update the client-side state i.e. Database > Client
  useEffect(() => {
    if (userData && userData.displayCurrency) {
      setDisplayCurrency(userData.displayCurrency);
    }
  }, [userData]);

  // Update the displayCurrency in the database whenever there is a change in client-side state i.e., Client > Database
  useEffect(() => {
    const userRef = ref(realTimeDatabase, `${DB_USERS_FOLDER_NAME}/${uid}`);
    update(userRef, { displayCurrency: displayCurrency });
  }, [displayCurrency]);

  // For GoogleMap: Create isLoaded variable and assign it the results of useLoadScript + google maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  // Format numbers to the decimal format i.e., add a comma for every thousand and decimal places if applicable
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  // Note which expense is 'selected' or 'highlighted', and to style it accordingly
  const handleOnSelect = (expense) => {
    if (highlighted === expense.id) {
      setHighlighted(null);
    } else {
      setHighlighted(expense.id);
      console.log(highlighted);
    }
  };

  // Deletes the expense in the database; function is passed to ListExpenses component, prefer to keep the function here to use the realtime database imports and ref's
  const handleDeleteExpenses = (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const expRef = ref(
        realTimeDatabase,
        `${DB_EXPENSES_FOLDER_NAME}/${uid}/${expenseId}`
      );
      remove(expRef)
        .then(() => {
          setShowToast(true);
        })
        .catch((error) => {
          console.error("Error deleting expense:", error);
        });
    }
  };

  return (
    <div>
      {/* Toast to notify user once expense has been successfully deleted */}
      <Toast
        className="center-toast"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={1500}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>Expense deleted successfully!</Toast.Body>
      </Toast>{" "}
      {isLoggedIn ? (
        readyToShow ? (
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
              currenciesList={currenciesList}
              handleDeleteExpenses={handleDeleteExpenses}
            />
          </div>
        ) : (
          <h2>Loading</h2>
        )
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
