import "../App.css";
import AllExpenses from "./AllExpenses";
import DisplayCurrency from "./DisplayCurrency";
// import EditExpenses from "./EditExpenses";
import Filter from "./Filter";
import InputExpenses from "./InputExpenses";
import { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ListExpenses({
  uid,
  groupedExpenses,
  expensesCategory,
  categoriesData,
  currenciesList,
  mapRef,
  lat,
  lng,
  setLat,
  setLng,
  expenseCounter,
  setExpenseCounter,
  displayCurrency,
  setDisplayCurrency,
  handleOnSelect,
  handleDeleteExpenses,
  formatter,
  isHighlighted,
  // isLoading,
  isLoadingExpenses,
}) {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const highlightedCardRef = useRef(null); // Create reference for highlighted card
  const [readyToShow, setReadyToShow] = useState(false);

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

  console.log("expensesCategory:", expensesCategory);

  // Sum up the totalAmount for all expenses to be displayed
  const totalAmount = expensesCategory.reduce(
    (accumulator, expense) => accumulator + parseFloat(expense.displayAmount),
    0
  );

  console.log("totalAmount", totalAmount);

  // Pan to latest expense location whenever there's a change in expenses
  useEffect(() => {
    // map to pan to most recently added expense
    const getLatestExpLocation = () => {
      const expensesArray = Object.values(expensesCategory);
      // console.log(expensesArray[0]);
      const lastExpense = expensesArray[0];
      if (lastExpense && !isNaN(lastExpense.lat) && !isNaN(lastExpense.lng)) {
        return { lat: lastExpense.lat, lng: lastExpense.lng };
      } else {
        return null;
      }
    };

    // Pan to latest expense location once extracted
    const fetchAndPanToLatestLocation = async () => {
      const location = await getLatestExpLocation();
      if (location !== null && isLoadingExpenses === false) {
        mapRef.panTo(location);
      }
    };

    if (groupedExpenses.length !== 0) {
      setReadyToShow(true);
    }

    fetchAndPanToLatestLocation();
  }, [expensesCategory, groupedExpenses]);

  // useEffect to cause highlighted card to scroll into view
  useEffect(() => {
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isHighlighted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyToShow(true);
    }, 10000); // Adjust this value as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  // console.log("list exp isLoadingExpenses", isLoadingExpenses);
  return (
    <div className="list-container">
      <div className="card-header">
        <div className="mini-navbar">
          <div>
            <DisplayCurrency
              displayCurrency={displayCurrency}
              setDisplayCurrency={setDisplayCurrency}
              totalAmount={formatter.format(totalAmount)}
              currenciesList={currenciesList}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "5svw",
            }}
          >
            <InputExpenses
              uid={uid}
              mapRef={mapRef}
              lat={lat}
              setLat={setLat}
              lng={lng}
              setLng={setLng}
              expensesCategory={expensesCategory}
              setExpenseCounter={setExpenseCounter}
              currenciesList={currenciesList}
              displayCurrency={displayCurrency}
              categoriesData={categoriesData}
            />
            <Filter style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>
      <div className="allExp-container">
        {isLoadingExpenses ? (
          <p style={{ textAlign: "center" }}>
            <em>Your expenses are currently being loaded</em>
          </p>
        ) : readyToShow ? (
          <div>
            <AllExpenses
              uid={uid}
              currenciesList={currenciesList}
              groupedExpenses={groupedExpenses}
              expensesCategory={expensesCategory}
              expenseCounter={expenseCounter}
              setExpenseCounter={setExpenseCounter}
              isHighlighted={isHighlighted}
              formatter={formatter}
              handleOnSelect={handleOnSelect}
              handleShowReceiptClick={handleShowReceiptClick}
              handleDeleteExpenses={handleDeleteExpenses}
              categoriesData={categoriesData}
            />
          </div>
        ) : (
          <p>Loading</p>
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
