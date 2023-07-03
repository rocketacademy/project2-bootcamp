import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export default function ExpPieChart({
  selectedPeriod,
  expensesCategory,
  categoriesData,
  view,
}) {
  /* Filter expenses based on the selected date. If selectedDate is not null, filter expensesList such that expense.date is equiv to selectedDate, else show all*/
  // console.log("view", view);
  // console.log("selectedPeriod", selectedPeriod);
  const filteredExpenses = selectedPeriod
    ? expensesCategory.filter((expense) => {
        if (view === "daily") {
          // Compare the full date (YYYY-MM-DD)
          return expense.date.slice(0, 10) === selectedPeriod;
        } else if (view === "monthly") {
          // Compare the year and month (YYYY-MM)
          return expense.date.slice(0, 7) === selectedPeriod;
        } else if (view === "yearly") {
          // Compare the year (YYYY)
          return expense.date.slice(0, 4) === selectedPeriod;
        } else {
          return false;
        }
      })
    : expensesCategory;
  // console.log("filteredExpenses:", filteredExpenses);

  // Calculate the sum of amounts by category
  const displayAmountByCategory = {};
  filteredExpenses.forEach((expense) => {
    const categoryName = expense.categoryName;
    const displayAmount = parseFloat(expense.displayAmount);
    if (!displayAmountByCategory[categoryName]) {
      displayAmountByCategory[categoryName] = 0;
    }
    displayAmountByCategory[categoryName] += displayAmount;
    displayAmountByCategory[categoryName] = parseFloat(
      displayAmountByCategory[categoryName].toFixed(2)
    );
  });
  // console.log("displayAmountByCategory", displayAmountByCategory);

  // convert object into array of arrays.map convert each inner array to an object
  const pieChartData = Object.entries(displayAmountByCategory).map(
    ([categoryName, displayAmount]) => ({
      categoryName,
      displayAmount,
    })
  );
  // console.log("pieChartData", pieChartData);

  // merge piechart with category to append the color and emoji
  const joinedPieChartData = useMemo(() => {
    return pieChartData.map((expense) => {
      const category = categoriesData.find(
        (category) => category.category === expense.categoryName
      );
      // Ensure a category is found. If not, provide a fallback category
      const fallbackCategory = category
        ? category
        : { category: "Unknown", color: "#000000", emoji: "❓" };
      return { ...expense, ...fallbackCategory };
    });
  }, [pieChartData, categoriesData]);
  // console.log("joinedPieChartData:", joinedPieChartData);

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={joinedPieChartData}
          cx={190}
          cy={105}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="displayAmount"
          label
        >
          {joinedPieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="top"
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>
              {entry.payload.emoji}
              {entry.payload.category}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
