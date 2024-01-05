import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// CSS
import "./AddTradeLineItem.css";

const AddTradeLineItem = () => {
  const [nameField, setNameField] = useState("");
  const [codeField, setCodeField] = useState("");
  const [dateField, setDateField] = useState("");
  const [priceField, setPriceField] = useState("");
  const [currencyField, setCurrencyField] = useState("");
  const [platformField, setPlatformField] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const fieldList = [
    { header: "Stock Name", value: nameField, setter: setNameField },
    { header: "Stock Code", value: codeField, setter: setCodeField },
    { header: "Date of Purchase", value: dateField, setter: setDateField },
    { header: "Purchase Price", value: priceField, setter: setPriceField },
    { header: "Currency", value: currencyField, setter: setCurrencyField },
    { header: "Platform", value: platformField, setter: setPlatformField },
  ];

  const inputFields = fieldList.map((item) => (
    <div className="input-fields">
      <h3>{item.header}</h3>
      <input
        type="text"
        key={item.header}
        value={item.value}
        onChange={(e) => handleChange(e, item.setter)}
      ></input>
      <p>{item.value}</p>
    </div>
  ));

  const resetFields = () => {
    fieldList.map((item) => item.setter(""));
  };

  const handleClose = (isSubmit) => {
    if (isSubmit) {
      // insert write data function here
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
