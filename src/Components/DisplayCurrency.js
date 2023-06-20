import React, { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import currencies from "./Currencies";

export default function DisplayCurrency({
  displayCurrency,
  setDisplayCurrency,
}) {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currenciesList, setCurrencies] = useState([]);

  const handleShow = () => {
    setShowCurrencyModal(true);
  };
  const handleClose = () => {
    setShowCurrencyModal(false);
  };

  const handleCurrencyChange = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();

    handleClose();
  };

  const currencyList = () => {
    const array = [];
    currencies.map((currency) => array.push(currency.code));
    return array;
  };

  useEffect(() => {
    setCurrencies(currencyList());
  }, []);

  return (
    <div>
      <div>
        <Button
          title="Click to change display currency"
          variant="secondary"
          onClick={handleShow}
        >
          {displayCurrency}
        </Button>
      </div>
      <Modal show={showCurrencyModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup className="mb-3">
              <Form.Label></Form.Label>
              <Typeahead
                id="currency-typeahead"
                labelKey="currency"
                value={displayCurrency}
                onChange={(selected) => setDisplayCurrency(selected)}
                options={currenciesList}
              ></Typeahead>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
