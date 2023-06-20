import "../App.css";
import InputExpenses from "./InputExpenses";
import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

export default function ListExpenses({
  uid,
  expenses,
  formatter,
  highlighted,
  handleOnSelect,
}) {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowReceiptClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const closeReceiptModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  // Map through expenses array and render each one as a card
  const allExp = expenses.map((expense) => (
    <div key={expense.id}>
      <Card onClick={() => handleOnSelect(expense)}>
        <Card.Header>{expense.date}</Card.Header>

        <Card.Body>
          <div className="card-content">
            <div>
              <Card.Title>
                {expense.category}
                {/* - {expense.location} */}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {expense.description}
                <br />
                {expense.currency} {formatter.format(expense.amount)}
              </Card.Subtitle>
              {/* <Card.Text></Card.Text> */}
            </div>

            <Button
              variant="info"
              onClick={() => handleShowReceiptClick(expense)}
              title="Click to view receipt"
            >
              Show Receipt
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  ));

  // Render the list of expenses
  return (
    <div className="list-container">
      <div className="card-header">
        <InputExpenses uid={uid} />
      </div>
      <div className="allExp-container">{allExp}</div>
      <Modal show={showModal} onHide={closeReceiptModal}>
        <Modal.Header closeButton>
          <Modal.Title>Receipt Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExpense && (
            <img
              src={selectedExpense.receiptUrl}
              alt="Expense"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReceiptModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
