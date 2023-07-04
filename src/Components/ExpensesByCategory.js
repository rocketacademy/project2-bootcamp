import React, { useState } from "react";
import { Card, Collapse } from "react-bootstrap";

export default function ExpensesByCategory({ filteredExpenses }) {
  const [openCardIndex, setOpenCardIndex] = useState(null);
  console.log("filteredExpenses:", filteredExpenses);

  const toggleCollapse = (index) => {
    if (openCardIndex === index) {
      setOpenCardIndex(null); // if it's already open, close it
    } else {
      setOpenCardIndex(index); // otherwise, open this one
    }
  };

  // Group expenses by category and sum them up
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    (acc[expense.category] = acc[expense.category] || []).push(expense);
    return acc;
  }, {});
  console.log("expensesByCategory", expensesByCategory);

  return (
    <div className="container mt-4">
      {Object.entries(expensesByCategory).map(([category, expenses], index) => {
        const total = expenses.reduce(
          (sum, expense) => sum + parseFloat(expense.displayAmount.toFixed(2)),
          0
        );
        return (
          <Card
            style={{ backgroundColor: expenses[0].color }} // using the color of the first expense in this category
            onClick={() => toggleCollapse(index)}
            aria-controls="collapseInfo"
          >
            <Card.Header style={{ fontWeight: "bold" }}>
              {expenses[0].emoji} {category}: {expenses[0].displayCurrency}{" "}
              {total}
            </Card.Header>
            <Collapse in={openCardIndex === index}>
              <div id="collapseInfo">
                {expenses.map((expense) => (
                  <Card.Body
                    key={expense.id}
                    style={{ backgroundColor: "white", textAlign: "left" }}
                  >
                    {/* Display the individual expense */}
                    <Card.Title>
                      <strong>Date:</strong> {expense.date}
                    </Card.Title>
                    <Card.Text>
                      <strong>Amount:</strong> {expense.displayCurrency}{" "}
                      {parseFloat(expense.displayAmount.toFixed(2))}
                      (${expense.currency} ${expense.amount})
                    </Card.Text>
                    <Card.Text>
                      <strong>Description:</strong> {expense.description}
                    </Card.Text>
                  </Card.Body>
                ))}
              </div>
            </Collapse>
          </Card>
        );
      })}
    </div>
  );
}
