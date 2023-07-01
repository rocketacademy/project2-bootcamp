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
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [focusBar, setFocusBar] = useState(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  const [view, setView] = useState("daily");

  // Find the minimum, maximum date in expensesList
  const calculateStartAndEndDates = (expensesCategory, view) => {
    let endDate = null;
    let firstDate = null;
    expensesCategory.forEach((expense) => {
      const date = new Date(expense.date);
      if (!endDate || date > endDate) {
        endDate = date;
      }
      if (!firstDate || date < firstDate) {
        firstDate = date;
      }
    });

    // Calculate the start date based on the view
    let startDate = new Date(endDate);
    if (view === "monthly") {
      startDate.setMonth(endDate.getMonth() - 12); // 1 month before end date
    } else if (view === "yearly") {
      startDate.setFullYear(endDate.getFullYear() - 3); // 3 years before end date
    } else {
      startDate.setDate(endDate.getDate() - 30); // 30 days before end date
    }

    // Check calculated start date with first date. If first date is later than calculated start date. set start date=first date
    if (firstDate > startDate) {
      startDate = firstDate;
    }

    return { startDate, endDate };
  };
  const { startDate, endDate } = calculateStartAndEndDates(
    expensesCategory,
    view
  );
  // console.log("start date", startDate);
  // console.log("end date", endDate);

  // generate a list of all possible period between start and end date
  const generateDatesInRange = (startDate, endDate, view) => {
    const dates = [];
    let currentDate = new Date(endDate);

    while (currentDate >= startDate) {
      let period;
      if (view === "daily") {
        period = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
      } else if (view === "monthly") {
        period = currentDate.toISOString().slice(0, 7); // YYYY-MM
      } else if (view === "yearly") {
        period = currentDate.toISOString().slice(0, 4); // YYYY
      }
      // only push period into dates if it is new
      if (!dates.includes(period)) {
        dates.push(period);
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates;
  };

  // function to calculate display amount
  const calculateDisplayAmount = (
    expensesCategory,
    view,
    startDate,
    endDate
  ) => {
    // sum display amount by period
    const displayAmountByPeriod = {};
    expensesCategory.forEach((expense) => {
      let period = new Date(expense.date);
      if (view === "monthly") {
        period = period.toISOString().slice(0, 7);
      } else if (view === "yearly") {
        period = period.toISOString().slice(0, 4);
      } else {
        period = expense.date;
      }
      // console.log("period", period);
      const displayAmount = parseFloat(expense.displayAmount);
      if (!displayAmountByPeriod[period]) {
        displayAmountByPeriod[period] = 0;
      }
      displayAmountByPeriod[period] += displayAmount;
      displayAmountByPeriod[period] = parseFloat(
        displayAmountByPeriod[period].toFixed(2)
      );
    });
    // console.log("displayAmountByPeriod: original", displayAmountByPeriod);

    // using all periods, insert in 0 for periods that are not in displayamountby period
    const allPeriods = generateDatesInRange(startDate, endDate, view);
    allPeriods.forEach((period) => {
      if (!displayAmountByPeriod[period]) {
        displayAmountByPeriod[period] = 0;
      }
    });
    return { allPeriods, displayAmountByPeriod };
  };

  // Then call this function with the selected view
  const { allPeriods, displayAmountByPeriod } = calculateDisplayAmount(
    expensesCategory,
    view,
    startDate,
    endDate
  );
  // console.log("actual return allPeriods", allPeriods);
  // console.log("actual return displayAmountByPeriod", displayAmountByPeriod);

  // Transform amountByDate into an array of objects with 'date' and 'amount' keys
  const chartData = allPeriods.map((period) => ({
    period,
    displayAmount: displayAmountByPeriod[period],
  }));
  // Sort the chartData array based on the date values
  chartData.sort((a, b) => new Date(a.period) - new Date(b.period));
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

  const viewButtons = ["daily", "monthly", "yearly"].map((viewName) => (
    <Button
      key={viewName}
      variant={view === viewName ? "warning" : "outline-warning"}
      onClick={() => setView(viewName)}
    >
      {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
    </Button>
  ));

  useEffect(() => {
    console.log(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Total spending </h1>
      <div className="dashboard-view-buttons">{viewButtons}</div>
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
          onClick={(state) => {
            if (state.activePayload) {
              const { period } = state.activePayload[0].payload;
              const index = state.activeTooltipIndex;
              if (period === selectedPeriod) {
                setSelectedPeriod(""); // unselect the bar if it's already selected
                setFocusBar(null); // remove focus from the bar
              } else {
                setSelectedPeriod(period); // select the bar
                setFocusBar(index); // set focus to the bar
              }
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="displayAmount" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell
                fill={
                  focusBar === index || focusBar === null
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
          expensesCategory={expensesCategory}
          selectedPeriod={selectedPeriod}
          categoriesData={categoriesData}
          view={view}
        />
      </div>
    </div>
  );
}
