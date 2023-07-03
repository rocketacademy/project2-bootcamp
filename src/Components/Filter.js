import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

export default function Filter({ setFilters, categoriesData }) {
  const endDate = new Date();
  const endDateFormatted = endDate.toISOString().substring(0, 10);
  const [selectedEndDate, setSelectedEndDate] = useState(endDateFormatted);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const startDateFormatted = startDate.toISOString().substring(0, 10);
  const [selectedStartDate, setSelectedStartDate] =
    useState(startDateFormatted);
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUpperLimit, setSelectedUpperLimit] = useState(null);
  const [selectedLowerLimit, setSelectedLowerLimit] = useState(null);

  const handleClear = () => {
    setSelectedEndDate(endDateFormatted);
    setSelectedStartDate(startDateFormatted);
    setSelectedCategory(null);
    setSelectedUpperLimit(null);
    setSelectedLowerLimit(null);

    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: null,
      endDate: null,
      category: selectedCategory,
      upperLimit: selectedUpperLimit,
      lowerLimit: selectedLowerLimit,
    }));

    setShow(false);
  };

  const handleSubmit = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: selectedCategory,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      upperLimit: selectedUpperLimit,
      lowerLimit: selectedLowerLimit,
    }));
    setShow(false);
  };

  return (
    <div>
      <span
        style={{ margin: "0 5px", cursor: "pointer" }}
        onClick={() => {
          setShow(true);
        }}
      >
        🗄️
      </span>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Expenses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Date from</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => {
                    if (
                      selectedEndDate &&
                      new Date(e.target.value) > new Date(selectedEndDate)
                    ) {
                      alert("Start date cannot be after end date.");
                    } else {
                      setSelectedStartDate(e.target.value);
                    }
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="endDate">
                <Form.Label>Date to</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => {
                    if (
                      selectedStartDate &&
                      new Date(e.target.value) < new Date(selectedStartDate)
                    ) {
                      alert("End date cannot be before start date.");
                    } else {
                      setSelectedEndDate(e.target.value);
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Form.Group className="mb-3" controlId="filter-category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  const selectedCategory = categoriesData.find(
                    (categoryObj) =>
                      `${categoryObj.emoji} ${categoryObj.category}` ===
                      e.target.value
                  );
                  setSelectedCategory(selectedCategory);
                }}
                required
              >
                <option value="" disabled>
                  Category
                </option>
                {categoriesData.map((categoryObj, index) => (
                  <option
                    key={index}
                    value={`${categoryObj.emoji} ${categoryObj.category}`}
                  >
                    {categoryObj.emoji} {categoryObj.category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row>
            <Col>
              {" "}
              <Form.Group className="mb-3" controlId="minAmount">
                <Form.Label>Min Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedLowerLimit}
                  value={selectedLowerLimit}
                  onChange={(e) => setSelectedLowerLimit(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <Form.Group className="mb-3" controlId="maxAmount">
                <Form.Label>Max Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedUpperLimit}
                  value={selectedUpperLimit}
                  onChange={(e) => setSelectedUpperLimit(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
