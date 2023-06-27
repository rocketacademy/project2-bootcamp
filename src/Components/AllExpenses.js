import "../App.css";
import EditExpenses from "./EditExpenses";
import { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Trash, FileImage } from "react-bootstrap-icons";

export default function AllExpenses({
  uid,
  setExpenseCounter,
  formatter,
  highlighted,
  handleOnSelect,
  currenciesList,
  handleDeleteExpenses,
  groupedExpenses,
  handleShowReceiptClick,
}) {
  const highlightedCardRef = useRef(null); // Create reference for highlighted card
  const [displayEntries, setDisplayEntries] = useState([]);
  const [tick, setTick] = useState(0); // Add this state variable

  console.log(`Grouped expenses: ${JSON.stringify(groupedExpenses, null, 2)}`);
  console.log(
    `Display entries before: ${JSON.stringify(displayEntries, null, 2)}`
  );

  useEffect(() => {
    if (Object.keys(groupedExpenses).length !== 0) {
      const expensesEntries = Object.entries(groupedExpenses);
      setDisplayEntries(expensesEntries);
      console.log(
        `Display entries during: ${JSON.stringify(displayEntries, null, 2)}`
      );
    }
  }, [groupedExpenses]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTick(tick + 1); // Update the state to force a re-render
    }, 5000); // 5000ms = 5s

    // Cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [tick]); // Depend on 'tick' so the effect runs each time 'tick' changes

  console.log(
    `Display entries after: ${JSON.stringify(displayEntries, null, 2)}`
  );
  return (
    <div>
      {Object.keys(displayEntries).length === 0 ? (
        <p>Loading</p>
      ) : (
        displayEntries.map(([date, expenses]) => (
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
                            <Card.Title>
                              {expense.categoryEmoji}
                              {expense.categoryName}
                            </Card.Title>
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
                              <FileImage
                                variant="info"
                                onClick={() => handleShowReceiptClick(expense)}
                                title="Click to view receipt"
                                style={{ margin: "5px" }}
                              />
                            ) : (
                              []
                            )}
                            <EditExpenses
                              uid={uid}
                              expense={expense}
                              currenciesList={currenciesList}
                              setExpenseCounter={setExpenseCounter}
                            />
                            <Trash
                              id="delete-button"
                              variant="danger"
                              onClick={() => handleDeleteExpenses(expense.id)}
                              title="Click to delete expense"
                              style={{ margin: "5px" }}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )
            )}
          </div>
        ))
      )}
    </div>
  );
}
