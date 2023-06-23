import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
export default function ExpPieChart({ expensesList, selectedDate }) {
  // Filter expenses based on the selected date
  const filteredExpenses = selectedDate
    ? expensesList.filter((expense) => expense.date === selectedDate)
    : expensesList;
  console.log("filtered below");
  console.log(filteredExpenses);

  // Calculate the sum of amounts by category
  const amountByCategory = {};
  filteredExpenses.forEach((expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    if (!amountByCategory[category]) {
      amountByCategory[category] = 0;
    }
    amountByCategory[category] += amount;
  });
  console.log(amountByCategory);
  const pieChartData = Object.entries(amountByCategory).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );
  console.log(pieChartData);
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={pieChartData}
          cx={190}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="amount"
          label
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="top"
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{entry.payload.category}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
