import "../App.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";

export default function InputExpenses() {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNewInput = () => {
    setCategory("");
  };

  // add to db
  const handleSubmit = (e) => {
    e.preventDefault();
    // Access the selected category value
    console.log(category);

    // const newExpense = {
    //   username: username,
    //   category: category,
    // };
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
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
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
              <Form.Select aria-label="Default select example" as={Col} md="6">
                <option>Currency</option>
                <option value="1">SGD</option>
                <option value="1">USD</option>
              </Form.Select>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control />
            </InputGroup>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Location</Form.Label>
              <Form.Control as="textarea" rows={1} />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description of item</Form.Label>
              <Form.Control as="textarea" rows={1} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload receipt</Form.Label>
              <Form.Control type="file" />
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
