import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Firebase
import { push, ref, set } from "firebase/database";
import { database } from "../../firebase.js";
import { auth } from "../../firebase.js";

// CSS
import "./AddTradeLineItem.css";
import { propTypes } from "react-bootstrap/esm/Image.js";

const TRADES_KEY = "trades";

const AddTradeLineItem = (props) => {
  const [user, setUser] = useState("noUser");
  const [userDisplayName, setUserDisplayName] = useState("noUserDisplayName");
  const [nameField, setNameField] = useState("");
  const [codeField, setCodeField] = useState("");
  const [buySellField, setBuySellField] = useState("Buy");
  const [dateField, setDateField] = useState("");
  const [priceField, setPriceField] = useState("");
  const [currencyField, setCurrencyField] = useState("");
  const [platformField, setPlatformField] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        setUser("noUser");
        setUserDisplayName("noUserDisplayName");
      } else {
        setUser(auth.currentUser.uid);
        setUserDisplayName(auth.currentUser.displayName);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const fieldList = [
    {
      header: "Stock Name",
      type: "text",
      value: nameField,
      setter: setNameField,
    },
    {
      header: "Stock Code",
      type: "text",
      value: codeField,
      setter: setCodeField,
    },
    {
      header: "Buy or Sell?",

      value: buySellField,
      setter: setBuySellField,
    },
    {
      header: "Date of Purchase",
      type: "date",
      value: dateField,
      setter: setDateField,
    },
    {
      header: "Purchase Price",
      type: "number",
      value: priceField,
      setter: setPriceField,
    },
    {
      header: "Currency",
      type: "text",
      value: currencyField,
      setter: setCurrencyField,
    },
    {
      header: "Platform",
      type: "text",
      value: platformField,
      setter: setPlatformField,
    },
  ];

  const inputFields = fieldList.map((item) => (
    <Form.Group controlId="date" bssize="large" key={item.header}>
      <Form.Label>{item.header}</Form.Label>
      {item.type ? (
        <Form.Control
          type={item.type}
          onChange={(e) => handleChange(e, item.setter)}
        />
      ) : (
        <select
          className="action-select"
          value={item.value}
          onChange={(e) => handleChange(e, item.setter)}
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      )}
    </Form.Group>
  ));

  const writeNewTrade = () => {
    const tradeRef = ref(database, `${user}/${TRADES_KEY}`);
    const newTradeRef = push(tradeRef);
    const tradeDate = new Date(dateField) - 0;
    set(newTradeRef, {
      stockCode: codeField,
      stockName: nameField,
      action: buySellField,
      date: tradeDate,
      price: priceField,
      currency: currencyField,
      platform: platformField,
    });
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const resetFields = () => {
    fieldList.map((item) => item.setter(""));
  };

  const handleClose = (isSubmit) => {
    if (isSubmit) {
      writeNewTrade();
      props.setFilter("none");
    }
    setShowModal(false);
    resetFields();
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>+ New Item</Button>
      <Modal
        show={showModal}
        dialogClassName="modal-100w"
        onHide={() => handleClose(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add your new trade here</Modal.Title>
        </Modal.Header>
        <Modal.Body className="input-fields-container">
          {inputFields}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleClose(true)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddTradeLineItem;
