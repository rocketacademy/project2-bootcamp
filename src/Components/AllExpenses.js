import "../App.css";
import EditExpenses from "./EditExpenses";
import { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";

export default function AllExpenses({
  uid,
  currenciesList,
  groupedExpenses,
  setExpenseCounter,
  isHighlighted,
  formatter,
  handleOnSelect,
  handleShowReceiptClick,
  handleDeleteExpenses,
}) {
  const highlightedCardRef = useRef(null); // Create reference for highlighted card

  // console.log("groupedExpenses", groupedExpenses);
  // console.log("groupedExpenses", groupedExpenses["2023-06-28"][0].id);
  return (
    <div>
      {Object.keys(groupedExpenses).length === 0 ? (
        <p>Loading</p>
      ) : (
        Object.entries(groupedExpenses).map(([date, expenses]) => (
          <div key={date}>
            {/*overall date header */}
            <Card.Header>{date}</Card.Header>
            {expenses.map(
              (expense) =>
                expense.displayAmount !== undefined && (
                  <div
                    key={expense.id}
                    className={`${
                      expense.id === isHighlighted ? "highlighted-card" : ""
                    }`}
                    ref={
                      expense.id === isHighlighted ? highlightedCardRef : null
                    }
                  >
                    <Card onClick={() => handleOnSelect(expense)}>
                      <Card.Body>
                        <div className="card-content">
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                width: "3rem",
                                height: "3rem",
                                fontSize: "2rem",
                                backgroundColor: expense.color,
                              }}
                            >
                              {expense.emoji}
                            </div>
                          </div>
                          <div>
                            <Card.Title>{expense.category}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {expense.description !== "-" ? (
                                <>
                                  {expense.description}
                                  <br />
                                </>
                              ) : null}
                              {expense.displayCurrency || expense.currency}
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {expense.receiptUrl ? (
                              <span
                                variant="info"
                                onClick={() => handleShowReceiptClick(expense)}
                                title="Click to view receipt"
                                style={{ margin: "5px" }}
                              >
                                🖼️
                              </span>
                            ) : (
                              []
                            )}
                            <EditExpenses
                              uid={uid}
                              expense={expense}
                              currenciesList={currenciesList}
                              setExpenseCounter={setExpenseCounter}
                            />
                            <span
                              id="delete-button"
                              variant="danger"
                              onClick={() => handleDeleteExpenses(expense.id)}
                              title="Click to delete expense"
                              style={{ margin: "5px" }}
                            >
                              🗑️
                            </span>
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
