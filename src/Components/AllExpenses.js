import "../App.css";
import EditExpenses from "./EditExpenses";
import { useEffect, useRef } from "react";
import { Card } from "react-bootstrap";

export default function AllExpenses({
  uid,
  currenciesList,
  groupedExpenses,
  expensesCategory,
  expenseCounter,
  setExpenseCounter,
  isHighlighted,
  formatter,
  handleOnSelect,
  handleShowReceiptClick,
  handleDeleteExpenses,
  categoriesData,
  filters,
}) {
  const highlightedCardRef = useRef(null); // Create reference for highlighted card
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return (
    <div>
      {Object.keys(groupedExpenses).length === 0 ? (
        <p>Loading</p>
      ) : (

        // Map through the object of date-grouped expenses
        Object.entries(groupedExpenses).map(([date, expenses]) => {
          let filteredExpenses = expenses.filter((expense) => {
            let expenseDate = new Date(date);
            let startDate = filters.startDate
              ? new Date(filters.startDate)
              : null;
            let endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && expenseDate < startDate) return false;
            if (endDate && expenseDate > endDate) return false;

            return true;
          });

          if (filteredExpenses.length === 0) return null;

          return (
            <div key={date}>
              {/*overall date header */}
              <div
                style={{
                  backgroundColor: "#D3D3D3",
                  color: "black",
                  padding: "5px 0px 5px 20px",
                  fontWeight: "bold",
                }}
              >
                <Card.Header>{date}</Card.Header>
              </div>

              {/* Map through the expenses within each date-group */}
              {expenses
                .filter((expense) => {
                  if (filters.category && expense.category !== filters.category)
                    return false;
                  if (
                    filters.lowerLimit &&
                    expense.displayAmount < filters.lowerLimit
                  )
                    return false;
                  if (
                    filters.upperLimit &&
                    expense.displayAmount > filters.upperLimit
                  )
                    return false;

                  return true;
                })
                .map(
                  (expense) =>
                    expense.displayAmount !== undefined && (
                      <div
                        key={expense.id}
                        className={`${
                          expense.id === isHighlighted ? "highlighted-card" : ""
                        }`}
                        ref={
                          expense.id === isHighlighted
                            ? highlightedCardRef
                            : null
                        }
                      >
                        <Card onClick={() => handleOnSelect(expense)}>
                          <Card.Body>
                            <div className="card-content">
                              {/* Additional div wrapper needed to keep the category icon circle round */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  id="for-icon"
                                  style={{ marginRight: "15px" }}
                                >
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
                                    {/* Show description if available */}
                                    {expense.description !== "-" ? (
                                      <>
                                        {expense.description}
                                        <br />
                                      </>
                                    ) : null}
                                    {/* Display displayCurrency+Amount, otherwise show input currency+amount */}
                                    {expense.displayCurrency ||
                                      expense.currency}
                                    {formatter.format(
                                      expense.displayAmount || expense.amount
                                    )}
                                    {/* If the displayCurrency is different from the input currency, show the input currency and amount */}
                                    {expense.displayCurrency !==
                                    expense.currency
                                      ? ` (${
                                          expense.currency
                                        } ${formatter.format(expense.amount)})`
                                      : null}
                                  </Card.Subtitle>
                                </div>
                              </div>

                              {/* Div to contain the emoji-buttons to show receipt, edit expense, delete expense */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {expense.receiptUrl ? (
                                  <span
                                    variant="info"
                                    onClick={() =>
                                      handleShowReceiptClick(expense)
                                    }
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
                                  expenseCounter={expenseCounter}
                                  setExpenseCounter={setExpenseCounter}
                                  categoriesData={categoriesData}
                                />
                                <span
                                  id="delete-button"
                                  variant="danger"
                                  onClick={() =>
                                    handleDeleteExpenses(expense.id)
                                  }
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
          );
        })

      )}
    </div>
  );
}
