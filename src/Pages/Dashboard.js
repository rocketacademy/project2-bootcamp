import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { realTimeDatabase } from "../firebase";
import { ref, get, child } from "firebase/database";
import { Button } from "react-bootstrap";
import ExpPieChart from "../Components/ExpPieChart";
// use all dates for x-axis
// able to change to day/ month/ year
// hover and can see the cat, item and amount in a list
export default function Dashboard({
  uid,
  isLoggedIn,
  expensesCategory,
  categoriesData,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [focusBar, setFocusBar] = useState(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  const [view, setView] = useState("daily");
  console.log("categoriesData:", categoriesData);
  // console.log("expensesCategory", expensesCategory);

  // Calculate the sum of amounts by date
  const displayAmountByDate = {};
  expensesCategory.forEach((expense) => {
    const date = expense.date;
    const displayAmount = parseFloat(expense.displayAmount);
    if (!displayAmountByDate[date]) {
      displayAmountByDate[date] = 0;
    }
    displayAmountByDate[date] += displayAmount;
    displayAmountByDate[date] = parseFloat(
      displayAmountByDate[date].toFixed(2)
    ); // round to 2dp
  });
  // console.log(displayAmountByDate);

  // Find the maximum date in expensesList
  let endDate = null;
  expensesCategory.forEach((expense) => {
    const date = expense.date;
    if (!endDate || new Date(date) > new Date(endDate)) {
      endDate = date;
    }
  });
  endDate = new Date(endDate);
  // console.log(`end date: ${endDate}`);

  // Find the minimum date in expensesList
  let startDate = null;
  expensesCategory.forEach((expense) => {
    const date = expense.date;
    if (!startDate || new Date(date) < new Date(startDate)) {
      startDate = date;
    }
  });
  startDate = new Date(startDate);
  // console.log(`start date: ${startDate}`);

  const generateDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(endDate);
    while (currentDate >= startDate) {
      dates.push(currentDate.toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates;
  };
  const allDates = generateDatesInRange(startDate, endDate);

  // Fill in missing dates with a value of 0
  allDates.forEach((date) => {
    if (!displayAmountByDate[date]) {
      displayAmountByDate[date] = 0;
    }
  });
  // console.log(displayAmountByDate);

  // Transform amountByDate into an array of objects with 'date' and 'amount' keys
  const chartData = allDates.map((date) => ({
    date,
    displayAmount: displayAmountByDate[date],
  }));
  // Sort the chartData array based on the date values
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log("chartData:", chartData);

  const CustomTooltip = ({ payload, label, active }) => {
    if (active) {
      return (
        <div className={"Custom-Tooltip"}>
          {label}
          <br />
          {"Amount: " + payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Total spending </h1>
      <div className="view-buttons">
        <Button variant="outline-warning" onClick={() => setView("daily")}>
          Daily
        </Button>
        <Button variant="outline-warning" onClick={() => setView("monthly")}>
          Monthly
        </Button>
        <Button variant="outline-warning" onClick={() => setView("yearly")}>
          Yearly
        </Button>
      </div>
      <div className="chart-container">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setFocusBar(state.activeTooltipIndex);
              setMouseLeave(false);
              const { date } = chartData[state.activeTooltipIndex];
              setSelectedDate(date);
            } else {
              setFocusBar(null);
              setMouseLeave(true);
              setSelectedDate("");
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="displayAmount" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell
                fill={
                  focusBar === index || mouseLeave
                    ? "#8884d8"
                    : "rgba(43, 92, 231, 0.2)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </div>
      <div className="chart-container">
        <ExpPieChart
          isLoggedIn={isLoggedIn}
          uid={uid}
          expensesCategory={expensesCategory}
          selectedDate={selectedDate}
          categoriesData={categoriesData}
        />
      </div>
    </div>
  );
}
