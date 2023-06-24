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
export default function Dashboard({ uid, isLoggedIn }) {
  // load expenses according to user
  const DB_EXPENSES_FOLDER_NAME = "expenses";
  const [expensesList, setExpensesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [focusBar, setFocusBar] = useState(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  const [view, setView] = useState("daily");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(realTimeDatabase);
        const snapshot = await get(
          child(dbRef, `${DB_EXPENSES_FOLDER_NAME}/${uid}`)
        );
        if (snapshot.exists()) {
          const expensesList = [];
          snapshot.forEach((childSnapshot) => {
            const expKey = childSnapshot.key;
            const expData = childSnapshot.val();
            console.log("Exp Data:", expData);
            expensesList.push({ id: expKey, ...expData });
          });
          setExpensesList(expensesList);
        }
      } catch (error) {
        console.log("Error retrieving expense data:", error);
      }
    };
    if (isLoggedIn) {
      fetchData();
    }
  }, [uid, isLoggedIn]);
  // Calculate the sum of amounts by date
  const amountByDate = {};
  expensesList.forEach((expense) => {
    const date = expense.date;
    const amount = parseFloat(expense.amount);
    if (!amountByDate[date]) {
      amountByDate[date] = 0;
    }
    amountByDate[date] += amount;
  });
  // console.log(amountByDate);
  // Find the maximum date in expensesList
  let endDate = null;
  expensesList.forEach((expense) => {
    const date = expense.date;
    if (!endDate || new Date(date) > new Date(endDate)) {
      endDate = date;
    }
  });
  endDate = new Date(endDate);
  // console.log(`end date: ${endDate}`);
  // Find the minimum date in expensesList
  let startDate = null;
  expensesList.forEach((expense) => {
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
  console.log(allDates);
  // Fill in missing dates with a value of 0
  allDates.forEach((date) => {
    if (!amountByDate[date]) {
      amountByDate[date] = 0;
    }
  });
  // console.log(amountByDate);
  // Transform amountByDate into an array of objects with 'date' and 'amount' keys
  const chartData = allDates.map((date) => ({
    date,
    amount: amountByDate[date],
  }));
  // Sort the chartData array based on the date values
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log(chartData);
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
  // const handleClick = (data, index) => {
  //   setSelectedDate(chartData[index].date);
  // };
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
          <YAxis domain={[0, "dataMax + 100"]} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell
                fill={
                  focusBar === index || mouseLeave
                    ? "#8884d8"
                    : "rgba(43, 92, 231, 0.2)"
                }
                // for this, we make the hovered colour #2B5CE7, else its opacity decreases to 20%
              />
            ))}
          </Bar>
        </BarChart>
      </div>
      <div className="chart-container">
        <ExpPieChart expensesList={expensesList} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
