import "../App.css";
import DisplayCurrency from "./DisplayCurrency";
import EditExpenses from "./EditExpenses";
import Filter from "./Filter";
import InputExpenses from "./InputExpenses";
import { useState, useRef, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";

export default function ListExpenses({
  uid,
  mapRef,
  lat,
  lng,
  setLat,
  setLng,
  expenses,
  expenseCounter,
  setExpenseCounter,
  formatter,
  highlighted,
  handleOnSelect,
  isLoading,
  displayCurrency,
  setDisplayCurrency,
  currenciesList,
  handleDeleteExpenses,
}) {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const highlightedCardRef = useRef(null); // Create reference for highlighted card

  // Display receipt when showReceipt button is clicked
  const handleShowReceiptClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  // Hide receipt when button is clicked
  const closeReceiptModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  // Sum up the totalAmount for all expenses to be displayed
  const totalAmount = expenses.reduce(
    (accumulator, expense) => accumulator + parseInt(expense.displayAmount),
    0
  );

  // Sort expenses by date, with the latest at the top of the list
  const sortedExpenses = expenses.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Group expenses by date
  const groupedExpenses = {};
  sortedExpenses.forEach((expense) => {
    const date = expense.date;
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });
  console.log(groupedExpenses);

  // Map through expenses array and render each one as a card
  const allExp = Object.entries(groupedExpenses).map(([date, expenses]) => (
    <div key={date}>
      {/*overall date header */}
      <Card.Header>{date}</Card.Header>
      {expenses.map(
        (expense) =>
          expense.displayAmount !== undefined && (
            <div
              key={expense.id}
              className={`${
                expense.id === highlighted ? "highlighted-card" : ""
              }`}
              ref={expense.id === highlighted ? highlightedCardRef : null}
            >
              <Card onClick={() => handleOnSelect(expense)}>
                <Card.Body>
                  <div className="card-content">
                    <div>
                      <Card.Title>{expense.category}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {expense.description !== "-" ? (
                          <>
                            {expense.description}
                            <br />
                          </>
                        ) : null}
                        {expense.displayCurrency || expense.currency}{" "}
                        {formatter.format(
                          expense.displayAmount || expense.amount
                        )}
                        {expense.displayCurrency !== expense.currency
                          ? ` (${expense.currency} ${formatter.format(
                              expense.amount
                            )})`
                          : null}
                      </Card.Subtitle>
                    </div>
                    <div>
                      {expense.receiptUrl ? (
                        <Button
                          variant="info"
                          onClick={() => handleShowReceiptClick(expense)}
                          title="Click to view receipt"
                          style={{ margin: "5px" }}
                        >
                          Show Receipt
                        </Button>
                      ) : (
                        []
                      )}
                      <EditExpenses
                        expense={expense}
                        currenciesList={currenciesList}
                      />
                      <Button
                        id="delete-button"
                        variant="danger"
                        onClick={() => handleDeleteExpenses(expense.id)}
                        title="Click to delete expense"
                        style={{ margin: "5px" }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )
      )}
    </div>
  ));

  // useEffect to cause highlighted card to scroll into view
  useEffect(() => {
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlighted]);

  return (
    <div className="list-container">
      <div className="card-header">
        <div className="mini-navbar">
          <DisplayCurrency
            displayCurrency={displayCurrency}
            setDisplayCurrency={setDisplayCurrency}
            totalAmount={formatter.format(totalAmount)}
            currenciesList={currenciesList}
          />
          <InputExpenses
            uid={uid}
            mapRef={mapRef}
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            expenses={expenses}
            expenseCounter={expenseCounter}
            setExpenseCounter={setExpenseCounter}
            currenciesList={currenciesList}
            displayCurrency={displayCurrency}
          />
          <Filter />
        </div>
      </div>
      <div className="allExp-container">
        {isLoading ? (
          <p style={{ textAlign: "center" }}>
            <em>Your expenses will appear here</em>
          </p>
        ) : expenses.length === 0 ? null : (
          allExp
        )}
      </div>

      {/* Modal to display receipt */}
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
