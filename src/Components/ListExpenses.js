import "../App.css";
import AllExpenses from "./AllExpenses";
import DisplayCurrency from "./DisplayCurrency";
import EditExpenses from "./EditExpenses";
import Filter from "./Filter";
import InputExpenses from "./InputExpenses";
import { useState, useRef, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { Trash, FileImage } from "react-bootstrap-icons";

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
  groupedExpenses,
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

  // Sum up the totalAmount for all expenses to be displayed
  const totalAmount = expenses.reduce(
    (accumulator, expense) => accumulator + parseInt(expense.displayAmount),
    0
  );

  // Map through expenses array and render each one as a card
  // const allExp = Object.entries(groupedExpenses).map(([date, expenses]) => (
  //   <div key={date}>
  //     {/*overall date header */}
  //     <Card.Header>{date}</Card.Header>
  //     {expenses.map(
  //       (expense) =>
  //         expense.displayAmount !== undefined && (
  //           <div
  //             key={expense.id}
  //             className={`${
  //               expense.id === highlighted ? "highlighted-card" : ""
  //             }`}
  //             ref={expense.id === highlighted ? highlightedCardRef : null}
  //           >
  //             <Card onClick={() => handleOnSelect(expense)}>
  //               <Card.Body>
  //                 <div className="card-content">
  //                   <div>
  //                     <Card.Title>
  //                       {expense.categoryEmoji}
  //                       {expense.categoryName}
  //                     </Card.Title>
  //                     <Card.Subtitle className="mb-2 text-muted">
  //                       {expense.description !== "-" ? (
  //                         <>
  //                           {expense.description}
  //                           <br />
  //                         </>
  //                       ) : null}
  //                       {expense.displayCurrency || expense.currency}{" "}
  //                       {formatter.format(
  //                         expense.displayAmount || expense.amount
  //                       )}
  //                       {expense.displayCurrency !== expense.currency
  //                         ? ` (${expense.currency} ${formatter.format(
  //                             expense.amount
  //                           )})`
  //                         : null}
  //                     </Card.Subtitle>
  //                   </div>
  //                   <div>
  //                     {expense.receiptUrl ? (
  //                       <FileImage
  //                         variant="info"
  //                         onClick={() => handleShowReceiptClick(expense)}
  //                         title="Click to view receipt"
  //                         style={{ margin: "5px" }}
  //                       />
  //                     ) : (
  //                       []
  //                     )}
  //                     <EditExpenses
  //                       uid={uid}
  //                       expense={expense}
  //                       currenciesList={currenciesList}
  //                       setExpenseCounter={setExpenseCounter}
  //                     />
  //                     <Trash
  //                       id="delete-button"
  //                       variant="danger"
  //                       onClick={() => handleDeleteExpenses(expense.id)}
  //                       title="Click to delete expense"
  //                       style={{ margin: "5px" }}
  //                     />
  //                   </div>
  //                 </div>
  //               </Card.Body>
  //             </Card>
  //           </div>
  //         )
  //     )}
  //   </div>
  // ));
  // setReadyToShow(true);
  // console.dir(allExp);
  // console.log(JSON.stringify(allExp));
  // console.log(allExp);

  // Pan to latest expense location whenever there's a change in expenses
  useEffect(() => {
    // map to pan to most recently added expense
    const getLatestExpLocation = () => {
      const expensesArray = Object.values(expenses);
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
      if (location !== null && isLoading === false) {
        mapRef.panTo(location);
      }
    };

    if (groupedExpenses.length !== 0) {
      setReadyToShow(true);
    }

    fetchAndPanToLatestLocation();
  }, [expenses, groupedExpenses]);

  // useEffect to cause highlighted card to scroll into view
  useEffect(() => {
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlighted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyToShow(true);
    }, 10000); // Adjust this value as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

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
              expenses={expenses}
              expenseCounter={expenseCounter}
              setExpenseCounter={setExpenseCounter}
              currenciesList={currenciesList}
              displayCurrency={displayCurrency}
            />
            <Filter style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>
      <div className="allExp-container">
        {isLoading ? (
          <p style={{ textAlign: "center" }}>
            <em>Your expenses will appear here</em>
          </p>
        ) : readyToShow ? (
          <div>
            <AllExpenses
              handleShowReceiptClick={handleShowReceiptClick}
              uid={uid}
              mapRef={mapRef}
              lat={lat}
              setLat={setLat}
              lng={lng}
              setLng={setLng}
              expenseCounter={expenseCounter}
              setExpenseCounter={setExpenseCounter}
              expenses={expenses}
              formatter={formatter}
              highlighted={highlighted}
              handleOnSelect={handleOnSelect}
              isLoading={isLoading}
              displayCurrency={displayCurrency}
              setDisplayCurrency={setDisplayCurrency}
              currenciesList={currenciesList}
              handleDeleteExpenses={handleDeleteExpenses}
              groupedExpenses={groupedExpenses}
              readyToShow={readyToShow}
              setReadyToShow={setReadyToShow}
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
