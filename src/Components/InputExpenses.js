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
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useLoaderData } from "react-router-dom";

const DB_EXPENSES_FOLDER_NAME = "expenses";
const STORAGE_EXPENSES_FOLDER_NAME = "receiptPhoto";

export default function InputExpenses({
  uid,
  userLocation,
  setUserLocation,
  mapRef,
  setMapRef,
  // isLoaded,
}) {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const currentDate = new Date().toISOString().substring(0, 10); // Get current date in yyyy-MM-dd format

  const [date, setDate] = useState(currentDate);
  const [receiptFile, setReceiptFile] = useState("");
  const [receiptFileValue, setReceiptFileValue] = useState("");

  const [selected, setSelected] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewInput = () => {
    setCategory("");
    setCurrency("");
    setAmount("");
    setLocation("");
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
    console.log(location);
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
      location: location,
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

  // code to cause map to pan to selected location
  // useEffect(() => {
  //   if (selected) {
  //     const newLocation = {
  //       lat: selected.value.geometry.location.lat(),
  //       lng: selected.value.geometry.location.lng(),
  //     };
  //     setUserLocation(newLocation);
  //     mapRef.panTo(newLocation);
  //   }
  // }, [selected, mapRef]);

  // code which causes an input field to try to autocomplete a user's search to return a place
  const PlacesAutocomplete = ({ setSelected }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    return (
      <Combobox>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
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
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
              </Form.Select>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </InputGroup>

            {/* <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Location</Form.Label>
              <GooglePlacesAutocomplete
                apiKey={process.env.REACT_APP_API_KEY}
                selectProps={{
                  value: userLocation,
                  onChange: setSelected,
                }}
                initialValue={
                  userLocation ? `${userLocation.lat}, ${userLocation.lng}` : ""
                }
              />
            </Form.Group> */}

            {/* {true ? <PlacesAutocomplete setSelected={setSelected} /> : null} */}

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
