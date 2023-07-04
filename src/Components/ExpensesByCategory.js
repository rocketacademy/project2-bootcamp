import React, { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";

export default function ExpensesByCategory({
  filteredExpenses,
  categoriesData,
}) {
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
            <Card.Header>
              {expenses[0].emoji}
              {category}: {expenses[0].displayCurrency}
              {total}
            </Card.Header>
            <Collapse in={openCardIndex === index}>
              <div id="collapseInfo">
                {expenses.map((expense) => (
                  <Card.Body key={expense.id}>
                    {/* Display the individual expense */}
                    <p>
                      {expense.date}
                      <br />
                      {expense.displayCurrency}
                      {parseFloat(expense.displayAmount.toFixed(2))}
                      <br />
                      {expense.description}
                    </p>
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
