import React, { useState, useEffect, useMemo } from "react";
import { realTimeDatabase } from "../firebase";
import { ref, get, child, onValue } from "firebase/database";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#c4babd",
  "#ef97ae",
];
export default function ExpPieChart({
  expensesList,
  selectedDate,
  uid,
  isLoggedIn,
}) {
  const DB_CATEGORY_FOLDER_NAME = "categories";
  const [categoriesData, setCategoriesData] = useState([]);
  // const [expensesListPie, setExpensesListPie] = useState(expensesList);

  useEffect(() => {
    const userCatRef = ref(
      realTimeDatabase,
      `${DB_CATEGORY_FOLDER_NAME}/${uid}`
    );
    // Attach an asynchronous callback to read the data at our categories reference
    const unsubscribe = onValue(
      userCatRef,
      (snapshot) => {
        const catData = snapshot.val();
        console.log(catData);
        if (catData) {
          const catArray = Object.entries(catData).map(([key, value]) => ({
            id: key,
            ...value,
          }));

          setCategoriesData(catArray);
          console.log("catArray:", catArray);
        }
      },
      (errorObject) => {
        console.log("The read failed: " + errorObject.name);
      }
    );

    return () => {
      // Remove the listener when the component unmounts
      unsubscribe();
    };
  }, [uid]);

  // Filter expenses based on the selected date
  // if selectedDate is not null, filter expensesList such that expense.date is equiv to selectedDate, else show all
  const filteredExpenses = selectedDate
    ? expensesList.filter((expense) => expense.date === selectedDate)
    : expensesList;
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
  console.log("displayAmountByCategory", displayAmountByCategory);
  const pieChartData = Object.entries(displayAmountByCategory).map(
    ([categoryName, displayAmount]) => ({
      categoryName,
      displayAmount,
    })
  );
  console.log("pieChartData", pieChartData);
  console.log("categoriesData:", categoriesData);
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
  console.log("joinedPieChartData:", joinedPieChartData);

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
