import "../App.css";
import { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup, Col } from "react-bootstrap";
import { realTimeDatabase, storage } from "../firebase";
import { push, ref, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Geocode from "react-geocode";
import currencies from "./Currencies";

const DB_EXPENSES_FOLDER_NAME = "expenses";
const STORAGE_EXPENSES_FOLDER_NAME = "receiptPhoto";

export default function InputExpenses({ uid }) {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("SGD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const currentDate = new Date().toISOString().substring(0, 10); // Get current date in yyyy-MM-dd format
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");

  const [date, setDate] = useState(currentDate);
  const [receiptFile, setReceiptFile] = useState("");
  const [receiptFileValue, setReceiptFileValue] = useState("");

  useEffect(() => {
    // Function to get user's location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Set the user's location to the 'address' state
            setAddress("Current Location");
            // setAddress(`Latitude: ${latitude}, Longitude: ${longitude}`);
            setLat(latitude);
            setLng(longitude);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Call the function to get user's location on component mount
    getUserLocation();
  }, []);

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewInput = () => {
    setCategory("");
    setAmount("");
    setDescription("");
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

    // get ref key
    const expRef = ref(realTimeDatabase, `${DB_EXPENSES_FOLDER_NAME}/${uid}`);
    const newExpRef = push(expRef);
    const newExpenseKey = newExpRef.key;
    set(newExpRef, {
      category: category,
      currency: currency,
      amount: amount,
      lat: lat,
      lng: lng,
      description: description,
      date: date,
    });
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

    handleClose();
    handleNewInput();
  };

  return (
    <div>
      <Button
        className="rounded-circle "
        variant="outline-info"
        onClick={handleShow}
      >
        +
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
              <option value="🍔Food">🍔Food</option>
              <option value="💸Bills">💸Bills</option>
              <option value="🚗Transport">🚗Transport</option>
              <option value="🏠Home">🏠Home</option>
              <option value="Others">Others</option>
            </Form.Select>
            <br />

            <InputGroup className="mb-3">
              <Form.Select
                aria-label="Default select example"
                as={Col}
                md="6"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                <option value="" disabled>
                  Currency
                </option>
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </Form.Select>
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
                  <em>Location not found, please enter another location</em>
                </div>
              )}
              <div id="address-look-up">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={address}
                    placeholder="Enter address or click on the map"
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
                    height: "30vh",
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
          <Button variant="primary" onClick={handleSubmit}>
            Add item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
