import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const FilterInputModal = (props) => {
  const [filterField, setFilterField] = useState("");
  const handleChange = (e) => {
    setFilterField(e.target.value);
  };

  const typeDisplay = {
    stockCode: "stock code",
    stockName: "stock name",
    platform: "platform",
  };

  const closeHandler = () => {
    setFilterField("");
    props.close();
  };

  const filterSetHandler = () => {
    props.setFilter(filterField);
    setFilterField("");
    props.close();
    return true;
  };
  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>Filter by: {typeDisplay[props.filterCat]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={filterField}
          onChange={(e) => handleChange(e)}
        ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={filterSetHandler}>
          Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterInputModal;
