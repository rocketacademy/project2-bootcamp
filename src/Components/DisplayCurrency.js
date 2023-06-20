import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal, InputGroup, Col } from "react-bootstrap";
import currencies from "./Currencies";

export default function DisplayCurrency({
  displayCurrency,
  setDisplayCurrency,
}) {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

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
        <Modal.Header>
          <Modal.Title>Update Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup className="mb-3">
              <Form.Select
                aria-label="Default select example"
                as={Col}
                md="6"
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
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
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Update Currency
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
