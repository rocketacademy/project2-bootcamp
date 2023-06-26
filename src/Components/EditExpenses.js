import "../App.css";
import { useEffect, useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import { realTimeDatabase, storage } from "../firebase";
import { push, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Geocode from "react-geocode";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const DB_EXPENSES_FOLDER_NAME = "expenses";
const STORAGE_EXPENSES_FOLDER_NAME = "receiptPhoto";

export default function EditExpenses({
  uid,
  mapRef,
  lat,
  setLat,
  lng,
  setLng,
  expenses,
  expenseCounter,
  setExpenseCounter,
  userLocation,
  currenciesList,
  displayCurrency,
}) {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  // inputCurrency
  const [currency, setCurrency] = useState("SGD");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("-");
  const currentDate = new Date().toISOString().substring(0, 10); // Get current date in yyyy-MM-dd format

  const [address, setAddress] = useState("");

  const [date, setDate] = useState(currentDate);
  const [receiptFile, setReceiptFile] = useState("");
  const [receiptFileValue, setReceiptFileValue] = useState("");

  // map to pan to most recently added expense
  const getLatestExpLocation = () => {
    const expensesArray = Object.values(expenses);
    const lastExpense = expensesArray[0];
    return lastExpense ? { lat: lastExpense.lat, lng: lastExpense.lng } : null;
  };

  // useEffect to pan to latest expense location once extracted
  useEffect(() => {
    const fetchAndPanToLatestLocation = async () => {
      const location = await getLatestExpLocation();
      if (location) {
        mapRef.panTo(location);
      }
    };

    fetchAndPanToLatestLocation();
  }, [expenses]);

  // Get lat and lng coordinates on 'look up' button press
  const getLatLng = () =>
    Geocode.fromAddress(address, process.env.REACT_APP_API_KEY).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      },
      (error) => {
        console.error(error);
        setLat(null);
        setLng(null);
      }
    );

  // functions to show / hide inputExpenses modal
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  // reset to prepare states for next input
  const handleNewInput = () => {
    setCategory("");
    setAmount(0);
    setAddress("");
    setDescription("-");
    setDate(currentDate);
    setReceiptFile("");
    setReceiptFileValue("");
  };

  // add to db
  const handleSubmit = (e) => {
    e.preventDefault();
    // Access the selected category value
    console.log(category);
    console.log(currency);
    console.log(amount);
    console.log(description);
    console.log(date);
    console.log(receiptFile);

    // get ref key
    const expRef = ref(realTimeDatabase, `${DB_EXPENSES_FOLDER_NAME}/${uid}`);
    const newExpRef = push(expRef);
    const newExpenseKey = newExpRef.key;
    // data to write to expense reference location
    set(newExpRef, {
      category: category,
      currency: currency,
      displayCurrency: displayCurrency,
      amount: amount,
      lat: lat,
      lng: lng,
      description: description,
      date: date,
    });

    if (receiptFile) {
      const expFileRef = storageRef(
        storage,
        ` ${STORAGE_EXPENSES_FOLDER_NAME}/${uid}/${receiptFile.name}`
      );

      uploadBytes(expFileRef, receiptFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((receiptUrl) => {
          // update expenses db with expenses photo url
          const currExpRef = ref(
            realTimeDatabase,
            `${DB_EXPENSES_FOLDER_NAME}/${uid}/${newExpenseKey}/receiptUrl`
          );
          set(currExpRef, receiptUrl);
        });
      });
    }

    handleClose();
    handleNewInput();
    setExpenseCounter((prevExpenseCounter) => prevExpenseCounter + 1);
  };

  return (
    <>
      <Button
        variant="warning"
        onClick={handleShow}
        title="Click to edit expense"
      >
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Input Expenses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Select
              aria-label="Default select example"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Category
              </option>
              <option value="🍔 Food">🍔 Food</option>
              <option value="💸 Bills">💸 Bills</option>
              <option value="🚗 Transport">🚗 Transport</option>
              <option value="🏠 Home">🏠 Home</option>
              <option value="🌏 Holiday">🌏 Holiday</option>
              <option value="🎬 Entertainment">🎬 Entertainment</option>
              <option value="🤷 Others">🤷 Others</option>
            </Form.Select>
            <br />

            <InputGroup className="mb-3">
              <Typeahead
                id="currency-typeahead"
                labelKey="currency"
                placeholder={currency}
                onChange={(selected) => setCurrency(selected[0])}
                options={currenciesList}
              ></Typeahead>

              <Form.Control
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </InputGroup>

            <Form.Group className="form-group">
              <Form.Label className="compact-label">Location</Form.Label>

              {lat && lng ? (
                <div className="coordinates-display green">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </div>
              ) : (
                <div
                  className="coordinates-display grey-italics"
                  style={{ color: "red" }}
                >
                  <em>Please input address</em>
                </div>
              )}
              <div id="address-look-up">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={address}
                    placeholder="Enter address, click on map, ignore to use current location"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    id="look-up-btn"
                    onClick={getLatLng}
                    style={{
                      flexShrink: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                    }}
                  >
                    Look up
                  </Button>
                </div>
              </div>

              <div id="loc-option-2">
                <GoogleMap
                  onClick={(e) => {
                    setLat(e.latLng.lat());
                    setLng(e.latLng.lng());
                  }}
                  mapContainerStyle={{
                    width: "100%",
                    height: "20vh",
                  }}
                  center={
                    lat && lng
                      ? { lat: lat, lng: lng }
                      : {
                          lat: 1.365,
                          lng: 103.815,
                        }
                  }
                  zoom={11}
                >
                  <MarkerF position={{ lat: lat, lng: lng }} />
                </GoogleMap>
                <br />
              </div>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description of item</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload receipt</Form.Label>
              <Form.Control
                type="file"
                value={receiptFileValue}
                onChange={(e) => {
                  setReceiptFile(e.target.files[0]);
                  setReceiptFileValue(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={category === "" || amount === 0}
          >
            Add item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
